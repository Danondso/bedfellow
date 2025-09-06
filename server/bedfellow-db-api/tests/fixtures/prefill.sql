-- Artist data
INSERT INTO artist (artist_name) VALUES
("Kanye West"),
("Ponderosa Twins Plus One"),
("Brenda Lee"),
("Wee"),
("Drake"),
("Jay-Z"),
("Eminem"),
("Nas"),
("Kendrick Lamar"),
("The Weeknd"),
("Post Malone"),
("Travis Scott");

-- Track data for samples
INSERT INTO track (artist_id, track_name, track_year, track_image) VALUES
((SELECT artist_id from artist WHERE artist_name = "Ponderosa Twins Plus One" LIMIT 1), "Bound", 1971, ""),
((SELECT artist_id from artist WHERE artist_name = "Brenda Lee" LIMIT 1), "Sweet Nothin's", 1959, ""),
((SELECT artist_id from artist WHERE artist_name = "Wee" LIMIT 1), "Aeroplane (Reprise)", 1977, ""),
((SELECT artist_id from artist WHERE artist_name = "Drake" LIMIT 1), "Started From the Bottom", 2013, ""),
((SELECT artist_id from artist WHERE artist_name = "Jay-Z" LIMIT 1), "99 Problems", 2003, ""),
((SELECT artist_id from artist WHERE artist_name = "Eminem" LIMIT 1), "Lose Yourself", 2002, ""),
((SELECT artist_id from artist WHERE artist_name = "Nas" LIMIT 1), "N.Y. State of Mind", 1994, ""),
((SELECT artist_id from artist WHERE artist_name = "Kendrick Lamar" LIMIT 1), "HUMBLE.", 2017, "");

-- Sample data with "Bound 2" for search test
INSERT INTO sample (track_name, track_artist, track_year, track_image, sample_artist_id, sample_track_id) VALUES
-- Bound 2 samples
("Bound 2", (SELECT artist_id from artist WHERE artist_name = "Kanye West" LIMIT 1), 2013, "", 2, 1),
("Bound 2", (SELECT artist_id from artist WHERE artist_name = "Kanye West" LIMIT 1), 2013, "", 3, 2),
("Bound 2", (SELECT artist_id from artist WHERE artist_name = "Kanye West" LIMIT 1), 2013, "", 4, 3),
-- Drake samples for pagination testing
("Hotline Bling", (SELECT artist_id from artist WHERE artist_name = "Drake" LIMIT 1), 2015, "", 3, 2),
("One Dance", (SELECT artist_id from artist WHERE artist_name = "Drake" LIMIT 1), 2016, "", 4, 3),
("God's Plan", (SELECT artist_id from artist WHERE artist_name = "Drake" LIMIT 1), 2018, "", 2, 1),
-- Jay-Z samples
("Big Pimpin'", (SELECT artist_id from artist WHERE artist_name = "Jay-Z" LIMIT 1), 1999, "", 2, 1),
("Hard Knock Life", (SELECT artist_id from artist WHERE artist_name = "Jay-Z" LIMIT 1), 1998, "", 3, 2),
-- Eminem samples
("Stan", (SELECT artist_id from artist WHERE artist_name = "Eminem" LIMIT 1), 2000, "", 4, 3),
("Without Me", (SELECT artist_id from artist WHERE artist_name = "Eminem" LIMIT 1), 2002, "", 2, 1),
-- Nas samples
("Made You Look", (SELECT artist_id from artist WHERE artist_name = "Nas" LIMIT 1), 2002, "", 3, 2),
("The Message", (SELECT artist_id from artist WHERE artist_name = "Nas" LIMIT 1), 1996, "", 4, 3),
-- Kendrick samples
("Swimming Pools", (SELECT artist_id from artist WHERE artist_name = "Kendrick Lamar" LIMIT 1), 2012, "", 2, 1),
("King Kunta", (SELECT artist_id from artist WHERE artist_name = "Kendrick Lamar" LIMIT 1), 2015, "", 3, 2),
-- The Weeknd samples
("Blinding Lights", (SELECT artist_id from artist WHERE artist_name = "The Weeknd" LIMIT 1), 2019, "", 4, 3),
("Starboy", (SELECT artist_id from artist WHERE artist_name = "The Weeknd" LIMIT 1), 2016, "", 2, 1);
