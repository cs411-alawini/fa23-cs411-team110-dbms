-- return table of number of monitoring sites per state >= 5

select State, count(SiteNum)
from Location
group by State
having count(SiteNum) >= 5;

-- Top 10 and bottom 10 NOMean (may be lower than 20 in count)

((select City, County, NoMean
from Measurements natural join Location
where CityCode = ccode and NoMean is not null
order by Measured desc
limit 10)
union
(select City, County, NoMean
from Measurements natural join Location
where CityCode = ccode and NoMean is not null
order by Measured asc
limit 10) ) order by NoMean desc;
