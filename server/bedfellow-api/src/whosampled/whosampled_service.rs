use crate::whosampled::structs::{WhoSampledSearchResponse, WhoSampledErrorResponse, Track};
use ego_tree::NodeRef;
use ego_tree::iter::Children;
use reqwest::{Client, StatusCode};
use scraper::html::Select;
use std::time::{SystemTime, UNIX_EPOCH};
use scraper::{Html,Selector, ElementRef, Node};

const BASE_URL: &str = "https://www.whosampled.com";

pub async fn get_sample_search_info(artist: String, track_name: String) -> Result<WhoSampledSearchResponse, WhoSampledErrorResponse> {
    let client: Client = build_whosampled_client();

    let timestamp: u128 = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();
    let response = client.get(format!("{}/ajax/search/", BASE_URL))
        .query(
            &[("q", format!("{} {}", artist, track_name)),
            ("_", timestamp.to_string())]
        )
        .send().await;

    match response {
        Ok(who_sampled_response) => Ok(who_sampled_response.json().await.unwrap()),
        Err (error) => Err({ WhoSampledErrorResponse {
            error: format!("Unable to process search request for '{} {}'. Error {:?}", artist, track_name, error),
        } })
    }
}

async fn get_whosampled_page(key: &str, artist: &str, track_name: &str) -> Option<String> {
    let client = build_whosampled_client();
  
    let mut response = client
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

    match response {
        Ok(ok) => Some(ok.text().await.unwrap()),
        Err(_) => None
    }
}

fn parse_whosampled_page(section_title: &str, page: Html) -> Vec<Track> {  
    
    let mut tracks: Vec<Track> = Vec::new();
    let section: Option<Children<Node>> = find_section_header(section_title, &page);

    if section.is_none() {
        info!("Unable to find section title {:?}", section_title);
        return tracks;
    }

    let sample_entries = section
        .expect("Header Section is unwrapped")
        .filter(|x| !x.value().is_text())
        .last()
        .unwrap()
        .children()
        .filter(|x| !x.value().is_text());

    for sample in sample_entries {
        let samples_children = sample.children().filter(|x| !x.value().is_text()).last();
        match samples_children {
                Some(last_child) => {
                    let track:Track = parse_track(ElementRef::wrap(last_child).unwrap());
                    tracks.push(track);     
                },
                None => warn!("samples_children does not contain any children, skipping..")
            }
        }
    return tracks;
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
                .expect("section header parent is unwrapped")
                .parent()
                .expect("section header grandparent is unwrapped")
                .children();
            return Some(section_grandparent);
        }
    }
    return None;
}

/* Parses track information for a given ElementRef
 * For artist and year, we move two siblings over which gives us the artist span, 
 * and the order of which ends up being [Text("by "), Element(<a href="/Ponderosa-Twins-Plus-One/">), Text(" (1971)\n")].
 * Given the ordering is reliable, we then check the first element to see if it's the text "by", if it is we get the 
 * 2nd and 3rd values of the nodes. We get artist name by pulling the text value from the last child of the element, and the
 * year from the text element, we then strip the year text of any non-numeric chars and parse to an int.
 * Once all the info is gathered, a Track struct returns it.
*/
fn parse_track (track_details :ElementRef) -> Track {
    let track_images:Vec<String> = parse_track_images(track_details);

    let details_inner = filter_element_ref_non_text_children(track_details);
    let root_sample_element: NodeRef<Node> = filter_node_ref_non_text_children(details_inner);

    let track_name: String = root_sample_element.value().as_element().unwrap().attr("title").unwrap().to_string();

    let artist_and_year_collection: Vec<NodeRef<'_, Node>> = root_sample_element.next_sibling().unwrap().next_sibling().unwrap().children().collect();
    
    let mut artist: String = "".to_owned();
    let mut year: i32 = 0;
    if artist_and_year_collection.len() > 0 && artist_and_year_collection.get(0).unwrap().value().as_text().unwrap().to_string().contains("by") {
        artist = artist_and_year_collection.get(1).unwrap().children().last().unwrap().value().as_text().unwrap().to_string();
        let raw_year: String = artist_and_year_collection.get(2).unwrap().value().as_text().unwrap().to_string().chars().filter(|c| c.is_digit(10)).collect(); 
        match raw_year.parse::<i32>() {
            Ok(raw_year) => year = raw_year ,
            Err(e) => warn!("Unable to parse {:?} {:?}", raw_year, e)
        }
        debug!("Artist and Year {:?} {:?}", artist, year);
    }

    return Track { track_name: track_name.replace(&artist, "").replacen("'s ", "", 1), artist, year, images: track_images };
}

fn parse_track_images(track_details: ElementRef) -> Vec<String> {
    let track_image_parent = track_details.prev_sibling().expect("track_details has previous sibling").prev_sibling();        
    match track_image_parent {
        Some(track_image_parent) => extract_img_srcset(track_image_parent),
        None => {
            warn!("Unable to find track details");
            return Vec::new();
        }
    }
}

fn extract_img_srcset(entry: NodeRef<Node>) -> Vec<String> {
    let last_child = entry.last_child().unwrap().value().as_element();
    match last_child {   
        Some(element) =>map_image_urls(element.attr("srcset").unwrap()),
        None => {
            warn!("child slated for image extraction is not an element");
            return Vec::new();
        }
    }
}

fn map_image_urls(image_srcset: &str) -> Vec<String> {
    return image_srcset.split(",")
    .map(|image_url_path| format!("{}{}", BASE_URL, image_url_path.trim()))
    .collect();
}

fn extract_inner_element_text_for_header(element_ref: ElementRef) -> String {
    let next_child = element_ref.children().next();
    match next_child {
        Some(child) => child.value().as_text().unwrap().to_string(),
        None => "".to_owned()
    }
}

fn filter_element_ref_non_text_children(element: ElementRef) -> NodeRef<Node> {
    return element.children().filter(|x| !x.value().is_text()).next().unwrap();
}

fn filter_node_ref_non_text_children(element: NodeRef<Node>) -> NodeRef<Node> {
    return element.children().filter(|x| !x.value().is_text()).next().unwrap();
}

fn build_whosampled_client() -> Client {
    let client_builder = reqwest::ClientBuilder::new();
    let client = client_builder
        .user_agent("Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148")
        .cookie_store(true)
        .use_rustls_tls()
        .build()
        .unwrap();
    return client;
}
