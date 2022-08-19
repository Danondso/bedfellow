import requests
import sys
import time
import json

base_url = "https://www.whosampled.com/ajax/search/"
headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36",
    "Accept": "application/json"
}

def get_whosampled_search_results(artist: str, track_name: str):
    try:
        params = {
            "_": int(round(time.time() * 1000)),
            "q": "{} {}".format(artist, track_name),
        }
        search_results = requests.get(base_url, headers=headers, params=params).json()
        return json.dumps(search_results)
    except:
        return {
            'error': 'unable to retrieve results'
        }

results = get_whosampled_search_results(artist=str(sys.argv[1]), track_name=str(sys.argv[2]))

# we print to stdout so rust can pick it up via it's Command call
print(results)

