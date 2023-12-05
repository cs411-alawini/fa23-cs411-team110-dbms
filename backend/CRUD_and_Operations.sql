/*
Here we'll write SQL queries that fulfill our functionality needs for the app, including CRUD operations,
our advanced operation, and anything else that we'll call from the backend to act on the database
*/

-- NOTE: ? acts as parameter placeholder for NodeJS (I think?)
-- NOTE: I'm returning the whole row for most of these on the assumption we can sort thru and grab what we need in the backend

-- CREATE new User -> when a user clicks "create new user" and enters appropriate fields ie:  Username, Password
insert into Users value(?,?,?,'Viewer')

-- READ UserRole for a given user
select UserRole from Users where Users.Username = ?

-- UPDATE UserRole -> done by admin only (need special ui for admin?)
update Users set UserRole = ? where Users.Username = ?

-- DELETE User -> done by admin only
delete from Users where Users.Username = ?

-- CREATE new pollutant record and insert into table -> done by users with "editor" or "admin" privilege using special interface for insertion
insert into Measurements value(?,?,?,?,?,?,?)

-- READ pollutant data records for a location -> when user queries a location in keyword search
-- NOTE: Depending on how we do searches, we might need to make different versions for querying county, state, etc.
select * from Measurements natural join Location where City = ?

-- READ pollutant data records for a particular time/date range -> when user queries pollutant data by time/date, may be helpful for heatmap?
select * from Measurements natural join Location where MeasureDate = ?

-- Check for existence of username/password pair, if match return relevant info (username,password,userRole, if not return nothing)
select userName


-- CREATE Review -> when user clicks "write review" and types into textbox interface for a particular location
insert into Reviews value(?,?,?,?,?,?)

-- READ Reviews by location -> return reviews for a particular location
select * from Review natural join Location where City = ?

-- READ Reviews by User -> return all reviews by a particular User
select * from Review where UserID = ?

-- UPDATE Review -> when user chooses to edit a review they have left
update Review set ReviewText = ? where UserID = ?

-- DELETE Review -> when user chooses to delete a review they have left
delete from Review where UserID = ?

-- CREATE SearchHistory -> when user writes a search in the search textbox
insert into SearchHistory value(?,?,?)

-- READ SearchHistory -> when a user chooses to look at their SearchHistory
select * from SearchHistory where UserID = ?

-- Advanced Operation (?)

