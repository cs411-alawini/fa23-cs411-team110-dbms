create table Users (
    UserID int primary key,
    Username varchar(20),
    UserPassword varchar(20),
    UserRole varchar(10)
);

create table Location (
    SiteNum int primary key,
    CityCode int,
    StateCode int,
    City varchar(25),
    County varchar(25),
    State varchar(25)
)

create table SearchHistory (
    SearchID int primary key,
    UserID int foreign key references Users(UserID) on delete cascade on update cascade,
    SearchQuery varchar(64)
);

create table Review (
    ReviewID int primary key,
    UserID int,
    ReviewText varchar(255),
    ReviewTimestamp Timestamp,
    SiteNum int,
    ReviewDate Date,
    foreign key (UserID) references Users(UserID) on delete cascade on update cascade,
    foreign key (SiteNum) references Location(SiteNum) on delete restrict on update cascade
);

create table Measurements (
    MeasurementID int primary key,
    SiteNum int foreign key references Location(SiteNum) on delete restrict on update cascade,
    MeasureDate date,
    No2Mean decimal,
    O3Mean decimal,
    So2Mean decimal,
    CoMean decimal
);
