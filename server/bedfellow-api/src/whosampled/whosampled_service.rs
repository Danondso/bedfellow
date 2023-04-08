use crate::whosampled::structs::{WhoSampledSearchResponse, WhoSampledErrorResponse, WhoSampledResponse, Track};
use ego_tree::iter::Children;
use reqwest::{Client, StatusCode};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};
use scraper::{Html,Selector, ElementRef, Node};

const BASE_URL: &str = "https://www.whosampled.com";

pub async fn get_sample_info(artist: &str, track_name: &str) -> Result<WhoSampledResponse, WhoSampledErrorResponse> {
    let endpoint_key_config = HashMap::from([
        ("samples", "Contains samples"),
        ("sampled", "Was sampled"),
        ("covered", "Was covered"),
    ]);

    let pages: HashMap<String, Html> = get_whosampled_pages(&endpoint_key_config, &artist, &track_name).await;

    let result: Result<WhoSampledResponse, WhoSampledErrorResponse> = parse_whosampled_pages(&endpoint_key_config, pages);

    if result.is_ok() {
        return Ok(result.unwrap());
    }
    
    let error_response: WhoSampledErrorResponse = { WhoSampledErrorResponse {
        error: format!("Unable to process sample info request for '{} {}'", artist, track_name),
    } };

    return Err(error_response);
}

pub async fn get_sample_search_info(artist: String, track_name: String) -> Result<WhoSampledSearchResponse, WhoSampledErrorResponse> {
    let client: Client = build_whosampled_client();

    let timestamp: u128 = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();
    let response = client.get(format!("{}/ajax/search/", BASE_URL))
        .query(
            &[("q", format!("{} {}", artist, track_name)),
            ("_", timestamp.to_string())]
        )
        .send().await;

    if response.is_ok() {
        let who_sampled_response: WhoSampledSearchResponse = response.unwrap().json().await.unwrap();
        return Ok(who_sampled_response);
    }

    let error_response: WhoSampledErrorResponse = { WhoSampledErrorResponse {
        error: format!("Unable to process search request for '{} {}'", artist, track_name),
    } };

    return Err(error_response);
}

async fn get_whosampled_pages(endpoint_key_config: &HashMap<&str, &str>, artist: &str, track_name: &str) -> HashMap<String, Html> {
    let client = build_whosampled_client();
    let mut responses = HashMap::new();

    for (key, _value) in endpoint_key_config {
        let mut response;
        response = client
            .get(format!("{}/{}/{}/{}", BASE_URL, artist, track_name, key))
            .send()
            .await;

        if response.is_err() || response.as_ref().unwrap().status() == StatusCode::NOT_FOUND {
            // whosampled returns a 404 if there's not enough data for a page
            // ie: if a song has two samples, the song/samples endpoint returns a 404
            // so we call the base url of artist/track_name and scrape from there
            response = client
                .get(format!("{}/{}/{}", BASE_URL, artist, track_name))
                .send()
                .await;
        }
    
        if response.is_err() {
            continue;
        }
        let html:Html = Html::parse_document(&response.unwrap().text().await.unwrap());
        responses.insert(key.to_string(), html.clone());
    }
    return responses;

}

fn parse_whosampled_pages(endpoint_key_config: &HashMap<&str, &str>, pages: HashMap<String, Html>) -> Result<WhoSampledResponse, WhoSampledErrorResponse> {    
    let result: WhoSampledResponse = { WhoSampledResponse {
        samples: Vec::new(),
        sampled_by: Vec::new(),
        covers: Vec::new(),
    } };

    for (key, value) in endpoint_key_config {
        let page = pages.get(key.clone()).unwrap();
        let section = find_section_header(value, page);
        if section.is_none() {
            continue;
        }
        let sample_entries = section
            .unwrap()
            .filter(|x| !x.value().is_text())
            .last()
            .unwrap()
            .children()
            .filter(|x| !x.value().is_text());

        for sample in sample_entries {
            let mut sample_children = sample.children().filter(|x| !x.value().is_text());
            let sample_entry = ElementRef::wrap(sample_children.next().unwrap()).unwrap();
            let track_details = ElementRef::wrap(sample_children.last().unwrap()).unwrap();
            let details_inner = track_details.children().filter(|x| !x.value().is_text()).next().unwrap();
            
            let track_name_element = details_inner.children().filter(|x| !x.value().is_text()).next().unwrap();
            let artist_and_year_element = details_inner.children().filter(|x| !x.value().is_text()).next().unwrap();
            // something broken here
                // let a = detail.first_child().unwrap();
                // let b = detail.last_child().unwrap();
                info!("{:?} {:?}",track_name_element, artist_and_year_element);
            }
            // let images: Vec<String> = extract_img_srcset(sample_entry);
            // info!("{:?}", track_details.value());
        }
        return Ok(result);
    }


    // return Ok(result);
    
    // let error_response: WhoSampledErrorResponse = { WhoSampledErrorResponse {
    //     error: "Unable to parse page results".to_string(),
    // } };

    // return Err(error_response);
// }

fn find_section_header<'a>(title: & str, html: &'a Html) -> Option<Children<'a, Node>>  {
    let section_header_selector = Selector::parse("span.section-header-title").unwrap();

    let section_headers = html.select(&section_header_selector);
    for section_header_element in section_headers {
        let section_header = extract_inner_element_text(section_header_element);
        if section_header.contains(title) {
            // section-header-title sits within a span inside of a header tag, so we get the grandparent
            let section_grandparent = section_header_element
                .parent()
                .unwrap()
                .parent()
                .unwrap()
                .children();
            return Some(section_grandparent);
        }
    }
    return None;
}

fn extract_inner_element_text(element_ref: ElementRef) -> String {
    return element_ref
        .children()
        .next()
        .unwrap()
        .value()
        .as_text()
        .unwrap()
        .to_string();
}

fn extract_img_srcset(entry: ElementRef) -> Vec<String> {
    return entry
        .children()
        .next()
        .unwrap()
        .value()
        .as_element()
        .unwrap()
        .attr("srcset")
        .unwrap()
        .to_string()
        .split(",").map(|image_url_path| format!("{}{}", BASE_URL, image_url_path)) // TODO trim off the 1x/2x at the end of these
        .collect(); // this yields image src set;
}

fn build_whosampled_client() -> Client {
    let client_builder = reqwest::ClientBuilder::new();
    let client = client_builder
        .user_agent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36")
        .cookie_store(true)
        .use_rustls_tls()
        .build()
        .unwrap();
    return client;
}
