create table Users (
    UserID int primary key,
    Username varchar(20) not null,
    UserPassword varchar(20) not null,
    UserRole varchar(10) default "Viewer"
);

create table Location (
    SiteNum int primary key,
    CountyCode int,
    StateCode int,
    City varchar(25),
    County varchar(25),
    State varchar(25)
)

create table SearchHistory (
    SearchID int primary key,
    UserID int,
    SearchQuery varchar(64),
    foreign key (UserID) references Users(UserID) on delete cascade on update cascade
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
    SiteNum int,
    MeasureDate date,
    No2Mean decimal,
    O3Mean decimal,
    So2Mean decimal,
    CoMean decimal,
    foreign key (SiteNum) references Location(SiteNum) on delete restrict on update cascade
);
