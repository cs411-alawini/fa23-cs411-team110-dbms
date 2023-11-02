-- return table of search queries for particular user

SELECT sh.SearchID, sh.SearchQuery
FROM SearchHistory sh natural join Users u
WHERE sh.UserID = (SELECT UserID FROM Users WHERE Username = ‘binchanrh’);

-- Top 10 and bottom 10 NOMean (may be lower than 20 in count)

((select City, County, No2Mean
from Measurements natural join Location
where City = “Phoenix” and No2Mean is not null
order by No2Mean desc
limit 10)
union all
(select City, County, No2Mean
from Measurements natural join Location
where City = “Phoenix” and No2Mean is not null
order by No2Mean
limit 5) );
