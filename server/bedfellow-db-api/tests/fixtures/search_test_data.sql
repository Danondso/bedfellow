-- Additional test data for search functionality tests

-- Add more artists for testing
INSERT INTO artist (artist_name) VALUES("Rick Ross");
INSERT INTO artist (artist_name) VALUES("Slick Rick");
INSERT INTO artist (artist_name) VALUES("The Rolling Stones");
INSERT INTO artist (artist_name) VALUES("Nick Drake");
INSERT INTO artist (artist_name) VALUES("Trick Daddy");

-- Add tracks for testing "ick" search
INSERT INTO track (artist_id, track_name, track_year, track_image)
VALUES((SELECT artist_id from artist WHERE artist_name = "Rick Ross" LIMIT 1), "Stick Talk", 2015, "");

INSERT INTO track (artist_id, track_name, track_year, track_image)
VALUES((SELECT artist_id from artist WHERE artist_name = "Slick Rick" LIMIT 1), "Children's Story", 1988, "");

INSERT INTO track (artist_id, track_name, track_year, track_image)
VALUES((SELECT artist_id from artist WHERE artist_name = "The Rolling Stones" LIMIT 1), "Sticky Fingers", 1971, "");

INSERT INTO track (artist_id, track_name, track_year, track_image)
VALUES((SELECT artist_id from artist WHERE artist_name = "Nick Drake" LIMIT 1), "Pink Moon", 1972, "");

INSERT INTO track (artist_id, track_name, track_year, track_image)
VALUES((SELECT artist_id from artist WHERE artist_name = "Trick Daddy" LIMIT 1), "Thug Life", 2001, "");

-- Add samples for search testing
-- Note: These samples reference tracks from the prefill.sql file
INSERT INTO sample (track_name, track_artist, track_year, track_image, sample_artist_id, sample_track_id) VALUES
    ("Stick Talk", 
     (SELECT artist_id from artist WHERE artist_name = "Rick Ross" LIMIT 1), 
     2015, 
     "", 
     (SELECT artist_id from artist WHERE artist_name = "Ponderosa Twins Plus One" LIMIT 1), 
     (SELECT track_id from track WHERE track_name = "Bound" LIMIT 1)),
    
    ("Quick Mix", 
     (SELECT artist_id from artist WHERE artist_name = "Slick Rick" LIMIT 1), 
     1988, 
     "", 
     (SELECT artist_id from artist WHERE artist_name = "Brenda Lee" LIMIT 1), 
     (SELECT track_id from track WHERE track_name = "Sweet Nothin's" LIMIT 1)),
    
    ("Sticky Situation", 
     (SELECT artist_id from artist WHERE artist_name = "The Rolling Stones" LIMIT 1), 
     1971, 
     "", 
     (SELECT artist_id from artist WHERE artist_name = "Wee" LIMIT 1), 
     (SELECT track_id from track WHERE track_name = "You Can Get Up Before Noon Without Being a Square" LIMIT 1)),
    
    ("Nick of Time", 
     (SELECT artist_id from artist WHERE artist_name = "Nick Drake" LIMIT 1), 
     1972, 
     "", 
     (SELECT artist_id from artist WHERE artist_name = "Ponderosa Twins Plus One" LIMIT 1), 
     (SELECT track_id from track WHERE track_name = "Bound" LIMIT 1)),
    
    ("Trick or Treat", 
     (SELECT artist_id from artist WHERE artist_name = "Trick Daddy" LIMIT 1), 
     2001, 
     "", 
     (SELECT artist_id from artist WHERE artist_name = "Brenda Lee" LIMIT 1), 
     (SELECT track_id from track WHERE track_name = "Sweet Nothin's" LIMIT 1));