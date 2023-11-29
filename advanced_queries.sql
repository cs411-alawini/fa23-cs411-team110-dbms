-- return table of search queries for particular user

DELIMITER //
create procedure UserQueries()
    SELECT sh.SearchID, sh.SearchQuery
    FROM SearchHistory sh natural join Users u
    WHERE sh.UserID = (SELECT UserID FROM Users WHERE Username = ‘binchanrh’);
end //
DELIMITER ;

-- Top 10 and bottom 10 NOMean (may be lower than 20 in count)


DELIMITER //
create procedure NoMean()
begin
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
end //
DELIMITER ;

-- Gets a pollutant score by comparing each pollutant with the distribution of all cities

create procedure GetPollutantScore(in citycode varchar(25), in formattedDate varchar(10), out no2grade varchar(2), out o3grade varchar(2), out so2grade varchar(2), out cograde varchar(2))
begin
    declare no2avg float; declare allno2avg float; declare allno2stddev float;
    declare o3avg float; declare allo3avg float; declare allo3stddev float;
    declare so2avg float; declare allso2avg float; declare allso2stddev float;
    declare coavg float; declare allcoavg float; declare allcostddev float;

    create table CityAverages as
    select City, avg(No2Mean) as cnavg, avg(O3Mean) as coavg, avg(So2Mean) as csavg, avg(CoMean) as ccavg
    from (select SiteNum, City from Location) natural join Measurements
    where MeasureDate > formattedDate -- date format has lexographic ordering
    group by City
    having count(MeasurementID) > 12 or City = citycode; -- more than 12 distinct day-avg samples

    select avg(No2Mean), stddev_pop(No2Mean), avg(O3Mean), stddev_pop(O3Mean), avg(So2Mean), stddev_pop(So2Mean), avg(CoMean), stddev_pop(CoMean)
    into allno2avg, allno2stddev, allo3avg, allo3stddev, allso2avg, allso2stddev, allcoavg, allcostddev
    from CityAverages;

    select cnavg, coavg, csavg, ccavg
    into no2avg, o3avg, so2avg, coavg
    from CityAverages
    where City = citycode;

    if (no2avg < allno2avg and (no2avg - allno2avg) / allno2stddev > -1) then set no2grade = "C";
    elseif (no2avg > allno2avg and (no2avg - allno2avg) / allno2stddev < 1) then set no2grade = "B";
    elseif no2avg > allno2avg then set no2grade = "A";
    elseif (no2avg < allno2avg and (no2avg - allno2avg) / allno2stddev > -2) then set no2grade = "D";
    elseif (no2avg < allno2avg) then set no2grade = "F";
    end if;

    if (o3avg < allo3avg and (o3avg - allo3avg) / allo3stddev > -1) then set o3grade = "C";
    elseif (o3avg > allo3avg and (o3avg - allo3avg) / allo3stddev < 1) then set o3grade = "B";
    elseif o3avg > allo3avg then set o3grade = "A";
    elseif (o3avg < allo3avg and (o3avg - allo3avg) / allo3stddev > -2) then set o3grade = "D";
    elseif (o3avg < allo3avg) then set o3grade = "F";
    end if;

    if (so2avg < allso2avg and (so2avg - allso2avg) / allso2stddev > -1) then set so2grade = "C";
    elseif (so2avg > allso2avg and (so2avg - allso2avg) / allso2stddev < 1) then set so2grade = "B";
    elseif so2avg > allso2avg then set so2grade = "A";
    elseif (so2avg < allso2avg and (so2avg - allso2avg) / allso2stddev > -2) then set so2grade = "D";
    elseif (so2avg < allso2avg) then set so2grade = "F";
    end if;

    if (coavg < allcoavg and (coavg - allcoavg) / allcostddev > -1) then set cograde = "C";
    elseif (coavg > allcoavg and (coavg - allcoavg) / allcostddev < 1) then set cograde = "B";
    elseif coavg > allcoavg then set cograde = "A";
    elseif (coavg < allcoavg and (coavg - allcoavg) / allcostddev > -2) then set cograde = "D";
    elseif (coavg < allcoavg) then set cograde = "F";
    end if;
end;
