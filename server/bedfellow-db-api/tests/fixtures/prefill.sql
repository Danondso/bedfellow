INSERT INTO artist (artist_name) VALUES("Kanye West");
INSERT INTO artist (artist_name) VALUES("Ponderosa Twins Plus One");
INSERT INTO artist (artist_name) VALUES("Brenda Lee");
INSERT INTO artist (artist_name) VALUES("Wee");
INSERT INTO track (artist_id, track_name, track_year, track_image)
VALUES((Select artist_id from artist WHERE artist_name = "Ponderosa Twins Plus One" LIMIT 1),"Bound",1971,"https://www.whosampled.com/static/images/media/track_images_200/lr60124_201393_14349154951.jpg");
INSERT INTO track (artist_id, track_name, track_year, track_image)
VALUES((Select artist_id from artist WHERE artist_name = "Brenda Lee" LIMIT 1),"Sweet Nothin's",1959,"https://www.whosampled.com/static/images/media/track_images_200/lr9591_2011312_14739796772.jpg");
INSERT INTO track (artist_id, track_name, track_year, track_image)VALUES((Select artist_id from artist WHERE artist_name = "Wee" LIMIT 1),"Aeroplane (Reprise)",1977,"https://www.whosampled.com/static/images/media/track_images_200/lr9591_2011312_14739796772.jpg");

INSERT INTO sample (track_name, track_artist, track_year, track_image, sample_artist_id, sample_track_id) VALUES
	("Bound 2", (SELECT artist_id from artist WHERE artist_name = "Kanye West" LIMIT 1), 2013, "image blob", 2, 5), 
	("Bound 2", (SELECT artist_id from artist WHERE artist_name = "Kanye West" LIMIT 1), 2013, "image blob", 3, 6),
	("Bound 2", (SELECT artist_id from artist WHERE artist_name = "Kanye West" LIMIT 1), 2013, "image blob", 4, 7)
;
