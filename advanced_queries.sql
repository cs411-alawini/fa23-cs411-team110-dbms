-- return table of number of monitoring sites per state that is wanted, having more than some desired count (high data)

delimiter //
create procedure StateMonitoringSites(in num int)
    select State, count(SiteNum)
    from Location
    group by State
    having count(SiteNum) >= num;
end //
delimiter ;

-- Top 10 and bottom 10 (may be lower than 20)
delimiter //
create procedure TopBottom10 (in ccode int, in pollutantnum int)
    (select City, County, Measured = case pollutantnum
        when 0 then No2Mean
        when 1 then O3Mean
        when 2 then So2Mean
        when 3 then CoMean
    end
    from Measurements natural join Location
    where CityCode = ccode and
    case pollutantnum
        when 0 then No2Mean
        when 1 then O3Mean
        when 2 then So2Mean
        when 3 then CoMean
    end is not null
    order by Measured desc
    limit 10) union
    (select City, County, Measured = case pollutantnum
        when 0 then No2Mean
        when 1 then O3Mean
        when 2 then So2Mean
        when 3 then CoMean
    end
    from Measurements natural join Location
    where CityCode = ccode and
    case pollutantnum
        when 0 then No2Mean
        when 1 then O3Mean
        when 2 then So2Mean
        when 3 then CoMean
    end is not null
    order by Measured asc
    limit 10);
end //
delimiter ;
