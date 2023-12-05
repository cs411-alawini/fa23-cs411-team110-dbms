-- return table of search queries for particular user

DELIMITER //
create procedure if not exists UserQueries()
begin
    SELECT sh.SearchID, sh.SearchQuery
    FROM SearchHistory sh natural join Users u
    WHERE sh.UserID = (SELECT UserID FROM Users WHERE Username = 'binchanrh');
end //

-- Top 10 and bottom 10 NOMean (may be lower than 20 in count)

create procedure if not exists NoMean()
begin
    ((select City, County, No2Mean
    from Measurements natural join Location
    where City = "Phoenix" and No2Mean is not null
    order by No2Mean desc
    limit 10)
    union all
    (select City, County, No2Mean
    from Measurements natural join Location
    where City = "Phoenix" and No2Mean is not null
    order by No2Mean
    limit 5) );
end //

-- Gets the cities (with sample size > 10) above a certain pollutant score, then returns them in a comma separated list: City,No2,o3,so2,co

create procedure if not exists GetPollutantScore(in formattedDate varchar(10), in cutoff varchar(2), out chosenCities varchar(5012))
begin
    declare no2avg float; declare allno2avg float; declare allno2stddev float;
    declare o3avg float; declare allo3avg float; declare allo3stddev float;
    declare so2avg float; declare allso2avg float; declare allso2stddev float;
    declare coavg float; declare allcoavg float; declare allcostddev float;
    declare CityTmp varchar(25);

    declare no2grade varchar(2) default "A";
    declare o3grade varchar(2) default "A";
    declare so2grade varchar(2) default "A";
    declare cograde varchar(2) default "A";

    declare done int default 0;
    declare cityIter cursor for
    select distinct SC.City, avg(No2Mean) as cnavg, avg(O3Mean) as coavg, avg(So2Mean) as csavg, avg(CoMean) as ccavg
    from (select SiteNum, City from Location) as SC natural join Measurements
    where MeasureDate > formattedDate -- date format has lexographic ordering
    group by SC.City
    having count(MeasurementID) > 10; -- more than 12 distinct day-avg samples
    declare continue handler for not found set done = 1;

    select avg(No2Mean), stddev_pop(No2Mean), avg(O3Mean), stddev_pop(O3Mean), avg(So2Mean), stddev_pop(So2Mean), avg(CoMean), stddev_pop(CoMean)
    into allno2avg, allno2stddev, allo3avg, allo3stddev, allso2avg, allso2stddev, allcoavg, allcostddev
    from Location natural join Measurements
    where MeasureDate > formattedDate and City in (select l.City from Location as l natural join Measurements group by l.City having count(MeasurementId) > 10);

    set chosenCities = "a";
    open cityIter;
    create table CityGrades (cname varchar(25), no2grade varchar(2), o3grade varchar(2), so2grade varchar(2), cograde varchar(2));
    repeat
        fetch cityIter into CityTmp, no2avg, o3avg, so2avg, coavg;

        if (no2avg < allno2avg) then set no2grade = "A";
        elseif (no2avg > allno2avg and (no2avg - allno2avg) / allno2stddev < 1) then set no2grade = "B";
        elseif (no2avg > allno2avg and (no2avg - allno2avg) / allno2stddev < 2) then set no2grade = "C";
        elseif (no2avg > allno2avg) then set no2grade = "F";
        else set no2grade = "A";
        end if;

        if (o3avg < allo3avg) then set o3grade = "A";
        elseif (o3avg > allo3avg and (o3avg - allo3avg) / allo3stddev < 1) then set o3grade = "B";
        elseif (o3avg > allo3avg and (o3avg - allo3avg) / allo3stddev > -2) then set o3grade = "C";
        elseif (o3avg > allo3avg) then set o3grade = "F";
        else set o3grade = "A";
        end if;

        if (so2avg < allso2avg) then set so2grade = "A";
        elseif (so2avg > allso2avg and (so2avg - allso2avg) / allso2stddev < 1) then set so2grade = "B";
        elseif (so2avg > allso2avg and (so2avg - allso2avg) / allso2stddev > -2) then set so2grade = "D";
        elseif (so2avg > allso2avg) then set so2grade = "F";
        else set so2avg = "A";
        end if;

        if (coavg < allcoavg) then set cograde = "A";
        elseif (coavg > allcoavg and (coavg - allcoavg) / allcostddev < 1) then set cograde = "B";
        elseif (coavg > allcoavg and (coavg - allcoavg) / allcostddev > -2) then set cograde = "D";
        elseif (coavg > allcoavg) then set cograde = "F";
        else set cograde = "A";
        end if;

        select cograde, so2grade, o3grade, no2grade;
        if (cograde <= cutoff and so2grade <= cutoff and o3grade <= cutoff and no2grade <= cutoff)
        then insert into CityGrades values (CityTmp, no2grade, o3grade, so2grade, cograde);
        end if;
    until done
    end repeat;
    close cityIter;

    select * from CityGrades;
    drop table CityGrades;
end //
DELIMITER ;

DELIMITER //
create trigger if not exists PollutantSpike after insert
on Measurements for each row
begin
    declare no2avg float;
    declare coavg float;
    declare o3avg float;
    declare so2avg float;
    declare newkey int;
    select max(ReviewID) + 1
    into newkey
    from Review;

    select avg(No2Mean), avg(CoMean), avg(O3Mean), avg(So2Mean)
    into no2avg, coavg, o3avg, so2avg
    from Location natural join Measurements
    where City = (select City from Location where SiteNum = new.SiteNum);

    if (new.No2Mean > no2avg + 8 or new.CoMean > coavg + 2 or new.O3Mean > o3avg + 2 or new.So2Mean > so2avg + 3)
    then insert into Review values (newkey, 3011, "Pollutant Spike Detected", CURRENT_TIMESTAMP, new.SiteNum, CURRENT_DATE);
    end if;
end //
DELIMITER ;
