from bs4 import BeautifulSoup
import re
import requests
import sys


# this maps the url path to what heading we're looking for in the page
paths_to_headings_config = {
    "/samples": "contains samples",
    "/sampled": "was sampled",
    "/covered": "was covered"
}
url_paths = list(paths_to_headings_config.keys())

base_url = "https://www.whosampled.com"
headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36",
}

def build_response(sections):
    response = {}
    response["samples"] = []
    response["sampledBy"] = []
    response["covered"] = []

    keys = ["samples", "sampledBy", "covered"]
    for i in range(len(sections)):
        key = keys[i]
        for song in sections[i].find_all("div", class_="sampleEntry"):
            track_details = song.find_all("div", class_="trackDetails")[0]
            sample = {}
            sample["track_name"] = track_details.find_all("a", class_="trackName")[0].contents[0]
            sample["artist"] = track_details.find_all("span", class_="trackArtist")[0].find_all("a")[0].contents[0]
            year = track_details.find_all("span", class_="trackArtist")[0].contents[-1]
            sample["year"] = int(re.findall(r"[0-9]+", year)[0])
            sample["images"] = song.find_all("a")[0].find_all('img')[0]['srcset'].split(',')
            response[key].append(sample)
    return response

def derive_sections(soup_sections):
    sections = []
    for soup_section in soup_sections:
        if soup_sections[soup_section] is not None:
            for entry in soup_sections[soup_section].find_all("span", class_="section-header-title"):
                heading = paths_to_headings_config[soup_section]
                if heading in entry.contents[0].lower():
                    sections.append(entry.parent.parent)
                    break
    return sections

def get_whosampled_pages(song_path):
    pages = {}
    for i in range(len(url_paths)):
        try:
            page = requests.get("{}{}{}".format(base_url, song_path, url_paths[i]), headers=headers)
            # whosampled doesn't have distinct pages for the urls paths if there's not enough data (<= 3 entries)
            # when that does occur we get the base page since we can suss out the results from there
            if page.status_code == 404:
                page = requests.get("{}{}".format(base_url, song_path), headers=headers)
            soup = BeautifulSoup(page.content, "html.parser")
            pages[url_paths[i]] = soup
        except:
            pages[url_paths[i]] = None
    return pages

whosampled_pages = get_whosampled_pages(str(sys.argv[1]))
print(whosampled_pages)
sections = derive_sections(whosampled_pages)
response = build_response(sections)

# we print to stdout so rust can pick it up via it's Command call
print(response)


