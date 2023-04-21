use crate::whosampled::structs::{WhoSampledSearchResponse, WhoSampledErrorResponse, WhoSampledResponse, Track};
use ego_tree::NodeRef;
use ego_tree::iter::Children;
use reqwest::{Client, StatusCode};
use scraper::html::Select;
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};
use scraper::{Html,Selector, ElementRef, Node};

const BASE_URL: &str = "https://www.whosampled.com";

pub async fn get_sample_info(artist: &str, track_name: &str) -> Result<WhoSampledResponse, WhoSampledErrorResponse> {
    let endpoint_key_config = HashMap::from([
        ("samples", "Contains samples"),
        ("sampled_by", "Was sampled"),
        ("covered", "Was covered"),
    ]);

    let mut sample_results: WhoSampledResponse = { WhoSampledResponse {
        samples: Vec::new(),
        sampled_by: Vec::new(),
        covers: Vec::new(),
    } };

    for (key, value) in endpoint_key_config {
        let page: Option<String> = get_whosampled_page(&key, &artist, &track_name).await;
        if page.is_some() {
            let p  = page.unwrap();


            let html:Html = Html::parse_document(&p);
            let result: Vec<Track> = parse_whosampled_page(value, html);
            info!("Key: {:?} and result {:?}", key, result);

            match key {
                "samples" => sample_results.samples = result,
                "sampled_by" => sample_results.sampled_by = result,
                "covered" => sample_results.covers = result,
                _ => error!("Unable to map {:?} sample results to final payload", key)
            }
        }

    }
    // TODO we need an error handling setup to better indicate what's happening
    return Ok(sample_results);
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

async fn get_whosampled_page(key: &str, artist: &str, track_name: &str) -> Option<String> {
    let client = build_whosampled_client();
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
        return None;
    }

    return Some(response.unwrap().text().await.unwrap());
}

fn parse_whosampled_page(section_title: &str, page: Html) -> Vec<Track> {  
    
    let mut tracks: Vec<Track> = Vec::new();
    let section: Option<Children<Node>> = find_section_header(section_title, &page);

    if section.is_none() {
        info!("Unable to find section title {:?}", section_title);
        // TODO consider returning something better than the empty tracks array
        return tracks;
    }

    let sample_entries = section
        .expect("Section is unwrapped")
        .filter(|x| !x.value().is_text())
        .last()
        .expect("Children are filtered of non text values")
        .children()
        .filter(|x| !x.value().is_text());

    for sample in sample_entries {
            let samples_children = sample.children().filter(|x| !x.value().is_text());
            let track_details = ElementRef::wrap(samples_children.last().unwrap()).unwrap();            
            let track = parse_track(track_details);
            
            tracks.push(track);
        }
    return tracks;
}

fn filter_element_ref_non_text_children(element: ElementRef) -> NodeRef<Node> {
    return element.children().filter(|x| !x.value().is_text()).next().unwrap();
}

fn filter_node_ref_non_text_children(element: NodeRef<Node>) -> NodeRef<Node> {
    return element.children().filter(|x| !x.value().is_text()).next().unwrap();
}

fn parse_track_images(track_details: ElementRef) -> Vec<String> {
    let track_image_parent = track_details.prev_sibling().unwrap().prev_sibling();
        
    let mut track_images: Vec<String> = Vec::new();
    if track_image_parent.is_some() {
       track_images = extract_img_srcset(track_image_parent.unwrap());  
    }

    debug!("Track images parsed {:?}", track_images);
    return track_images;
}

fn find_section_header<'a>(title: &'a str, html: &'a Html) -> Option<Children<'a, Node>> {
    let section_header_selector: Selector = Selector::parse("span.section-header-title").unwrap();

    let section_headers: Select = html.select(&section_header_selector);
    for section_header_element in section_headers {
        let section_header: String = extract_inner_element_text_for_header(section_header_element);
        if section_header.contains(title) {
            // section-header-title sits within a span inside of a header tag
            // so we get the grandparent which contains the sample entries
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

fn extract_inner_element_text_for_header(element_ref: ElementRef) -> String {
    return element_ref
        .children()
        .next()
        .unwrap()
        .value()
        .as_text()
        .unwrap()
        .to_string();
}

fn parse_track (track_details :ElementRef) -> Track {
    let track_images:Vec<String> = parse_track_images(track_details); // TODO put this shit into the Track
    
    let details_inner = filter_element_ref_non_text_children(track_details);
    let root_sample_element: NodeRef<Node> = filter_node_ref_non_text_children(details_inner);

    let track_name: String = root_sample_element.value().as_element().unwrap().attr("title").unwrap().to_string();
        // for artist and year, we move two siblings over which gives us the artist span 
        // first_child() -> by
        // last_child() -> year
        let artist_and_year_collection: Vec<NodeRef<'_, Node>> = root_sample_element.next_sibling().unwrap().next_sibling().unwrap().children().collect();
        
        let mut artist: String = "".to_owned();
        let mut year: i32 = 0;
        // TODO this is a mess, make it a safer to unwrap
        // The DOM portion representing the artist and year looks like this
        // Text("by ")
        // Element(<a href="/Ponderosa-Twins-Plus-One/">)
        // Text(" (1971)\n")
        if artist_and_year_collection.len() > 0 && artist_and_year_collection.get(0).unwrap().value().as_text().unwrap().to_string().contains("by") {
            artist = artist_and_year_collection.get(1).unwrap().children().last().unwrap().value().as_text().unwrap().to_string();
            let raw_year: String = artist_and_year_collection.get(2).unwrap().value().as_text().unwrap().to_string().chars().filter(|c| c.is_digit(10)).collect(); 
            match raw_year.parse::<i32>() {
                Ok(raw_year) => year = raw_year ,
                Err(e) => warn!("Unable to parse {:?} {:?}", raw_year, e)
            }
            debug!("Artist and Year {:?} {:?}", artist, year);
        }

        let track:Track = Track { track_name, artist, year, images: track_images };

        return track;
}

// TODO for these extractions we need a definitive check that gurantees the result before calling
fn extract_img_srcset(entry: NodeRef<Node>) -> Vec<String> {
    return entry
        .last_child()
        .unwrap()
        .value()
        .as_element()
        .unwrap()
        .attr("srcset")
        .unwrap()
        .split(",").map(|image_url_path| format!("{}{}", BASE_URL, image_url_path.trim())) // TODO trim off the 1x/2x at the end of these
        .collect();
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
