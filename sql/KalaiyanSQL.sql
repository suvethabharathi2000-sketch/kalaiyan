CREATE TABLE Users
(
    UserId INT NOT NULL AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Users PRIMARY KEY (UserId),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT UQ_Users_Phone UNIQUE (PhoneNumber),

    CONSTRAINT CK_Users_Role
        CHECK (Role IN ('Customer', 'Artisan', 'Admin'))
);

INSERT INTO Users
(FullName, Email, PhoneNumber, PasswordHash, Role)
VALUES
('Arun Kumar', 'arun@gmail.com', '9876500001', 'password_hash_001', 'Customer'),
('Priya Sharma', 'priya@gmail.com', '9876500002', 'password_hash_002', 'Customer'),
('Ravi Kumar', 'ravi@gmail.com', '9876500003', 'password_hash_003', 'Artisan'),
('Suresh Arts', 'suresh@gmail.com', '9876500004', 'password_hash_004', 'Artisan'),
('Admin', 'admin@gmail.com', '9876500005', 'password_hash_005', 'Admin');

CREATE TABLE Customers
(
    CustomerId INT NOT NULL AUTO_INCREMENT,
    UserId INT NOT NULL,
    Address VARCHAR(500),
    City VARCHAR(100),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Customers PRIMARY KEY (CustomerId),

    CONSTRAINT UQ_Customers_UserId UNIQUE (UserId),

    CONSTRAINT FK_Customers_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
);
CREATE TABLE Artisans
(
    ArtisanId INT NOT NULL AUTO_INCREMENT,
    UserId INT NOT NULL,
    CompanyName VARCHAR(150),
    ExperienceYears INT,
    ServiceArea VARCHAR(200),
    Description VARCHAR(1000),
    IsApproved BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Artisans PRIMARY KEY (ArtisanId),

    CONSTRAINT UQ_Artisans_UserId UNIQUE (UserId),

    CONSTRAINT FK_Artisans_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId),

    CONSTRAINT CK_Artisans_Experience
        CHECK (ExperienceYears >= 0)
);INSERT INTO Artisans
(UserId, CompanyName, ExperienceYears, ServiceArea, Description, IsApproved)
VALUES
(3, 'Ravi Art Studio', 8, 'Chennai',
 'Professional charcoal and colour pencil artist', TRUE),

(4, 'Suresh Painting Studio', 5, 'Chennai',
 'Professional portrait and painting artist', TRUE);
 CREATE TABLE Categories
(
    CategoryId INT NOT NULL AUTO_INCREMENT,
    CategoryName VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Categories PRIMARY KEY (CategoryId),

    CONSTRAINT UQ_Categories_CategoryName
        UNIQUE (CategoryName)
);
INSERT INTO Categories
(CategoryName, Description)
VALUES
('Charcoal Pencil',
 'Charcoal pencil drawing and portrait artwork'),

('Colour Pencil',
 'Colour pencil drawing and portrait artwork'),

('Painting',
 'Portrait and creative painting services');
 
 CREATE TABLE ServiceRequests
(
    RequestId INT NOT NULL AUTO_INCREMENT,

    CustomerId INT NOT NULL,

    CategoryId INT NOT NULL,

    Description VARCHAR(2000) NULL,

    Size VARCHAR(50) NOT NULL,

    NoOfFaces INT NOT NULL DEFAULT 1,

    SubjectImages VARCHAR(1000) NULL,

    Location VARCHAR(500) NOT NULL,

    Budget DECIMAL(10,2) NOT NULL,

    Deadline DATE NOT NULL,

    Instructions VARCHAR(2000) NULL,

    RequestStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt DATETIME NULL,

    CONSTRAINT PK_ServiceRequests
        PRIMARY KEY (RequestId),

    CONSTRAINT FK_ServiceRequests_Customers
        FOREIGN KEY (CustomerId)
        REFERENCES Customers(CustomerId),

    CONSTRAINT FK_ServiceRequests_Categories
        FOREIGN KEY (CategoryId)
        REFERENCES Categories(CategoryId),

    CONSTRAINT CK_ServiceRequests_Faces
        CHECK (NoOfFaces > 0),

    CONSTRAINT CK_ServiceRequests_Budget
        CHECK (Budget > 0),

    CONSTRAINT CK_ServiceRequests_Status
        CHECK
        (
            RequestStatus IN
            (
                'Pending',
                'Accepted',
                'Rejected',
                'WorkStarted',
                'WorkCompleted',
                'Cancelled',
                'Completed'
            )
        )
);

INSERT INTO ServiceRequests
(
    CustomerId,
    CategoryId,
    Description,
    Size,
    NoOfFaces,
    SubjectImages,
    Location,
    Budget,
    Deadline,
    Instructions,
    RequestStatus
)
VALUES
(
    1,
    1,
    'Need a realistic family portrait using charcoal pencil.',
    'A3',
    4,
    'family_photo.jpg',
    'Anna Nagar, Chennai',
    5000.00,
    '2026-10-10',
    'Use realistic shading. Keep all four faces clearly visible.',
    'Pending'
);
INSERT INTO ServiceRequests
(
    CustomerId,
    CategoryId,
    Description,
    Size,
    NoOfFaces,
    SubjectImages,
    Location,
    Budget,
    Deadline,
    Instructions,
    RequestStatus
)
VALUES
(
    1,
    1,
    'Need a realistic family portrait using charcoal pencil.',
    'A3',
    4,
    'family_photo.jpg',
    'Anna Nagar, Chennai',
    5000.00,
    '2026-10-10',
    'Use realistic shading. Keep all four faces clearly visible.',
    'Pending'
);
CREATE TABLE Orders
(
    OrderId INT NOT NULL AUTO_INCREMENT,

    RequestId INT NOT NULL,
    CustomerId INT NOT NULL,
    ArtisanId INT NOT NULL,

    PlatformFeePercent DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    PlatformFee DECIMAL(10,2) NOT NULL,

    TotalAmount DECIMAL(10,2) NOT NULL,

    AdvanceAmount DECIMAL(10,2) NOT NULL,
    RemainingAmount DECIMAL(10,2) NOT NULL,

    OrderStatus VARCHAR(30) NOT NULL DEFAULT 'Created',

    AcceptedAt DATETIME NULL,
    StartedAt DATETIME NULL,
    CompletedAt DATETIME NULL,

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Orders
        PRIMARY KEY (OrderId),

    CONSTRAINT UQ_Orders_RequestId
        UNIQUE (RequestId),

    CONSTRAINT FK_Orders_Request
        FOREIGN KEY (RequestId)
        REFERENCES ServiceRequests(RequestId),

    CONSTRAINT FK_Orders_Customer
        FOREIGN KEY (CustomerId)
        REFERENCES Customers(CustomerId),

    CONSTRAINT FK_Orders_Artisan
        FOREIGN KEY (ArtisanId)
        REFERENCES Artisans(ArtisanId),

    CONSTRAINT CK_Orders_Amount
        CHECK
        (
            PlatformFeePercent >= 0
            AND PlatformFee >= 0
            AND TotalAmount > 0
            AND AdvanceAmount > 0
            AND RemainingAmount >= 0
        )
);

INSERT INTO Orders
(
    RequestId,
    CustomerId,
    ArtisanId,
    PlatformFeePercent,
    PlatformFee,
    TotalAmount,
    AdvanceAmount,
    RemainingAmount,
    OrderStatus,
    AcceptedAt
)
VALUES
(
    1,
    1,
    1,
    10.00,
    500.00,
    5500.00,
    1650.00,
    3850.00,
    'Created',
    CURRENT_TIMESTAMP
);

INSERT INTO Orders
(
    RequestId,
    CustomerId,
    ArtisanId,
    PlatformFeePercent,
    PlatformFee,
    TotalAmount,
    AdvanceAmount,
    RemainingAmount,
    OrderStatus,
    AcceptedAt
)
VALUES
(
    2,
    2,
    2,
    10.00,
    1200.00,
    13200.00,
    3960.00,
    9240.00,
    'Created',
    CURRENT_TIMESTAMP
);

CREATE TABLE Payments
(
    PaymentId INT NOT NULL AUTO_INCREMENT,
    OrderId INT NOT NULL,

    PaymentType VARCHAR(20) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod VARCHAR(30) NOT NULL,

    PaymentStatus VARCHAR(20) NOT NULL DEFAULT 'Pending',

    TransactionReference VARCHAR(100),
    PaymentDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Payments PRIMARY KEY (PaymentId),

    CONSTRAINT FK_Payments_Orders
        FOREIGN KEY (OrderId)
        REFERENCES Orders(OrderId),

    CONSTRAINT CK_Payments_Type
        CHECK (PaymentType IN ('Advance', 'Final')),

    CONSTRAINT CK_Payments_Method
        CHECK
        (
            PaymentMethod IN
            (
                'UPI',
                'Card',
                'Cash',
                'NetBanking'
            )
        ),

    CONSTRAINT CK_Payments_Status
        CHECK
        (
            PaymentStatus IN
            (
                'Pending',
                'Success',
                'Failed',
                'Refunded'
            )
        ),

    CONSTRAINT CK_Payments_Amount
        CHECK (Amount > 0)
);

INSERT INTO Payments
(
    OrderId,
    PaymentType,
    Amount,
    PaymentMethod,
    PaymentStatus,
    TransactionReference
)
VALUES
(
    1,
    'Advance',
    1500.00,
    'UPI',
    'Success',
    'TXN-ADV-10001'
);
INSERT INTO Payments
(
    OrderId,
    PaymentType,
    Amount,
    PaymentMethod,
    PaymentStatus,
    TransactionReference
)
VALUES
(
    1,
    'Final',
    3500.00,
    'UPI',
    'Success',
    'TXN-FINAL-10001'
);
CREATE TABLE Reviews
(
    ReviewId INT NOT NULL AUTO_INCREMENT,
    OrderId INT NOT NULL,
    CustomerId INT NOT NULL,
    ArtisanId INT NOT NULL,

    Rating INT NOT NULL,
    Comment VARCHAR(500),

    ReviewDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_Reviews PRIMARY KEY (ReviewId),

    CONSTRAINT UQ_Reviews_OrderId
        UNIQUE (OrderId),

    CONSTRAINT FK_Reviews_Order
        FOREIGN KEY (OrderId)
        REFERENCES Orders(OrderId),

    CONSTRAINT FK_Reviews_Customer
        FOREIGN KEY (CustomerId)
        REFERENCES Customers(CustomerId),

    CONSTRAINT FK_Reviews_Artisan
        FOREIGN KEY (ArtisanId)
        REFERENCES Artisans(ArtisanId),

    CONSTRAINT CK_Reviews_Rating
        CHECK (Rating BETWEEN 1 AND 5)
);

INSERT INTO Reviews
(
    OrderId,
    CustomerId,
    ArtisanId,
    Rating,
    Comment
)
VALUES
(
    1,
    1,
    1,
    5,
    'Excellent charcoal portrait. Very professional work.'
);
USE ArtServiceDB;

DELIMITER $$

CREATE PROCEDURE sp_User_Register
(
    IN p_FullName VARCHAR(100),
    IN p_Email VARCHAR(150),
    IN p_PhoneNumber VARCHAR(15),
    IN p_PasswordHash VARCHAR(255),
    IN p_Role VARCHAR(20)
)
BEGIN

    IF EXISTS (
        SELECT 1
        FROM Users
        WHERE Email = p_Email
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already exists.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM Users
        WHERE PhoneNumber = p_PhoneNumber
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Phone number already exists.';
    END IF;

    INSERT INTO Users
    (
        FullName,
        Email,
        PhoneNumber,
        PasswordHash,
        Role,
        IsActive,
        CreatedAt
    )
    VALUES
    (
        p_FullName,
        p_Email,
        p_PhoneNumber,
        p_PasswordHash,
        p_Role,
        TRUE,
        NOW()
    );

    SELECT
        UserId,
        FullName,
        Email,
        PhoneNumber,
        PasswordHash,
        Role,
        IsActive,
        CreatedAt
    FROM Users
    WHERE UserId = LAST_INSERT_ID();

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_User_Login
(
    IN p_Email VARCHAR(150)
)
BEGIN

    SELECT
        UserId,
        FullName,
        Email,
        PhoneNumber,
        PasswordHash,
        Role,
        IsActive,
        CreatedAt
    FROM Users
    WHERE Email = p_Email
      AND IsActive = TRUE
    LIMIT 1;

END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE sp_User_GetProfile
(
    IN p_UserId INT
)
BEGIN

    SELECT
        UserId,
        FullName,
        Email,
        PhoneNumber,
        PasswordHash,
        Role,
        IsActive,
        CreatedAt
    FROM Users
    WHERE UserId = p_UserId
    LIMIT 1;

END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE sp_Customer_CreateProfile
(
    IN p_UserId INT,
    IN p_Address VARCHAR(500),
    IN p_City VARCHAR(100)
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM Users
        WHERE UserId = p_UserId
          AND Role = 'Customer'
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer user not found.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM Customers
        WHERE UserId = p_UserId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile already exists.';
    END IF;

    INSERT INTO Customers
    (
        UserId,
        Address,
        City,
        CreatedAt
    )
    VALUES
    (
        p_UserId,
        p_Address,
        p_City,
        NOW()
    );

    SELECT
        CustomerId,
        UserId,
        Address,
        City,
        CreatedAt
    FROM Customers
    WHERE CustomerId = LAST_INSERT_ID();

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_Customer_GetProfile
(
    IN p_UserId INT
)
BEGIN

    SELECT
        CustomerId,
        UserId,
        Address,
        City,
        CreatedAt
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE sp_Customer_UpdateProfile
(
    IN p_UserId INT,
    IN p_Address VARCHAR(500),
    IN p_City VARCHAR(100)
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM Customers
        WHERE UserId = p_UserId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    UPDATE Customers
    SET
        Address = p_Address,
        City = p_City
    WHERE UserId = p_UserId;

    SELECT
        CustomerId,
        UserId,
        Address,
        City,
        CreatedAt
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_ServiceRequest_Create
(
    IN p_UserId INT,
    IN p_CategoryId INT,
    IN p_Description VARCHAR(2000),
    IN p_Size VARCHAR(50),
    IN p_NoOfFaces INT,
    IN p_SubjectImages VARCHAR(1000),
    IN p_Location VARCHAR(500),
    IN p_Budget DECIMAL(10,2),
    IN p_Deadline DATE,
    IN p_Instructions VARCHAR(2000)
)
BEGIN

    DECLARE v_CustomerId INT;

    SELECT CustomerId
    INTO v_CustomerId
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_CustomerId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Categories
        WHERE CategoryId = p_CategoryId
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Category not found or inactive.';
    END IF;

    IF p_NoOfFaces <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Number of faces must be greater than zero.';
    END IF;

    IF p_Budget <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Budget must be greater than zero.';
    END IF;

    IF p_Deadline < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Deadline cannot be in the past.';
    END IF;

    INSERT INTO ServiceRequests
    (
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt
    )
    VALUES
    (
        v_CustomerId,
        p_CategoryId,
        p_Description,
        p_Size,
        p_NoOfFaces,
        p_SubjectImages,
        p_Location,
        p_Budget,
        p_Deadline,
        p_Instructions,
        'Pending',
        NOW()
    );

    SELECT
        RequestId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt,
        UpdatedAt
    FROM ServiceRequests
    WHERE RequestId = LAST_INSERT_ID();

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_ServiceRequest_GetCustomerRequests
(
    IN p_UserId INT
)
BEGIN

    SELECT
        sr.RequestId,
        sr.CustomerId,
        sr.CategoryId,
        c.CategoryName,
        sr.Description,
        sr.Size,
        sr.NoOfFaces,
        sr.SubjectImages,
        sr.Location,
        sr.Budget,
        sr.Deadline,
        sr.Instructions,
        sr.RequestStatus,
        sr.CreatedAt,
        sr.UpdatedAt
    FROM ServiceRequests sr
    INNER JOIN Customers cu
        ON sr.CustomerId = cu.CustomerId
    INNER JOIN Categories c
        ON sr.CategoryId = c.CategoryId
    WHERE cu.UserId = p_UserId
    ORDER BY sr.CreatedAt DESC;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_ServiceRequest_GetDetails
(
    IN p_UserId INT,
    IN p_RequestId INT
)
BEGIN

    SELECT
        sr.RequestId,
        sr.CustomerId,
        sr.CategoryId,
        c.CategoryName,
        c.Description AS CategoryDescription,
        sr.Description,
        sr.Size,
        sr.NoOfFaces,
        sr.SubjectImages,
        sr.Location,
        sr.Budget,
        sr.Deadline,
        sr.Instructions,
        sr.RequestStatus,
        sr.CreatedAt,
        sr.UpdatedAt
    FROM ServiceRequests sr
    INNER JOIN Customers cu
        ON sr.CustomerId = cu.CustomerId
    INNER JOIN Categories c
        ON sr.CategoryId = c.CategoryId
    WHERE cu.UserId = p_UserId
      AND sr.RequestId = p_RequestId
    LIMIT 1;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_ServiceRequest_Cancel
(
    IN p_UserId INT,
    IN p_RequestId INT
)
BEGIN

    DECLARE v_RequestStatus VARCHAR(30);

    SELECT sr.RequestStatus
    INTO v_RequestStatus
    FROM ServiceRequests sr
    INNER JOIN Customers cu
        ON sr.CustomerId = cu.CustomerId
    WHERE sr.RequestId = p_RequestId
      AND cu.UserId = p_UserId
    LIMIT 1;

    IF v_RequestStatus IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Service request not found.';
    END IF;

    IF v_RequestStatus NOT IN ('Pending') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only pending requests can be cancelled.';
    END IF;

    UPDATE ServiceRequests
    SET
        RequestStatus = 'Cancelled',
        UpdatedAt = NOW()
    WHERE RequestId = p_RequestId;

    SELECT
        RequestId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt,
        UpdatedAt
    FROM ServiceRequests
    WHERE RequestId = p_RequestId;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_CreateProfile
(
    IN p_UserId INT,
    IN p_CompanyName VARCHAR(150),
    IN p_ExperienceYears INT,
    IN p_ServiceArea VARCHAR(200),
    IN p_Description VARCHAR(1000)
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM Users
        WHERE UserId = p_UserId
          AND Role = 'Artisan'
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan user not found.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM Artisans
        WHERE UserId = p_UserId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile already exists.';
    END IF;

    IF p_ExperienceYears IS NOT NULL
       AND p_ExperienceYears < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Experience years cannot be negative.';
    END IF;

    INSERT INTO Artisans
    (
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        IsApproved,
        CreatedAt
    )
    VALUES
    (
        p_UserId,
        p_CompanyName,
        p_ExperienceYears,
        p_ServiceArea,
        p_Description,
        TRUE,
        NOW()
    );

    SELECT
        ArtisanId,
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        IsApproved,
        CreatedAt
    FROM Artisans
    WHERE ArtisanId = LAST_INSERT_ID();

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_GetProfile
(
    IN p_UserId INT
)
BEGIN

    SELECT
        ArtisanId,
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        IsApproved,
        CreatedAt
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_UpdateProfile
(
    IN p_UserId INT,
    IN p_CompanyName VARCHAR(150),
    IN p_ExperienceYears INT,
    IN p_ServiceArea VARCHAR(200),
    IN p_Description VARCHAR(1000)
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM Artisans
        WHERE UserId = p_UserId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    IF p_ExperienceYears IS NOT NULL
       AND p_ExperienceYears < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Experience years cannot be negative.';
    END IF;

    UPDATE Artisans
    SET
        CompanyName = p_CompanyName,
        ExperienceYears = p_ExperienceYears,
        ServiceArea = p_ServiceArea,
        Description = p_Description
    WHERE UserId = p_UserId;

    SELECT
        ArtisanId,
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        IsApproved,
        CreatedAt
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_Artisan_CreateProfile;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_CreateProfile
(
    IN p_UserId INT,
    IN p_CompanyName VARCHAR(150),
    IN p_ExperienceYears INT,
    IN p_ServiceArea VARCHAR(200),
    IN p_Description VARCHAR(1000),
    IN p_PreviousWorkImages VARCHAR(2000)
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM Users
        WHERE UserId = p_UserId
          AND Role = 'Artisan'
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan user not found.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM Artisans
        WHERE UserId = p_UserId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile already exists.';
    END IF;

    IF p_ExperienceYears IS NOT NULL
       AND p_ExperienceYears < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Experience years cannot be negative.';
    END IF;

    INSERT INTO Artisans
    (
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        PreviousWorkImages,
        IsApproved,
        CreatedAt
    )
    VALUES
    (
        p_UserId,
        p_CompanyName,
        p_ExperienceYears,
        p_ServiceArea,
        p_Description,
        p_PreviousWorkImages,
        TRUE,
        NOW()
    );

    SELECT
        ArtisanId,
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        PreviousWorkImages,
        IsApproved,
        CreatedAt
    FROM Artisans
    WHERE ArtisanId = LAST_INSERT_ID();

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_GetProfile;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_GetProfile
(
    IN p_UserId INT
)
BEGIN

    SELECT
        ArtisanId,
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        PreviousWorkImages,
        IsApproved,
        CreatedAt
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_AcceptRequest;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_AcceptRequest
(
    IN p_UserId INT,
    IN p_RequestId INT
)
BEGIN

    DECLARE v_ArtisanId INT;
    DECLARE v_CustomerId INT;
    DECLARE v_Budget DECIMAL(10,2);
    DECLARE v_RequestStatus VARCHAR(30);

    DECLARE v_PlatformFeePercent DECIMAL(5,2) DEFAULT 10.00;
    DECLARE v_PlatformFee DECIMAL(10,2);
    DECLARE v_TotalAmount DECIMAL(10,2);
    DECLARE v_AdvanceAmount DECIMAL(10,2);
    DECLARE v_RemainingAmount DECIMAL(10,2);

    DECLARE v_OrderId INT;

    START TRANSACTION;

    -- Get Artisan
    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';

    END IF;


    -- Lock and get request
    SELECT
        CustomerId,
        Budget,
        RequestStatus
    INTO
        v_CustomerId,
        v_Budget,
        v_RequestStatus
    FROM ServiceRequests
    WHERE RequestId = p_RequestId
    FOR UPDATE;


    -- Request not found
    IF v_CustomerId IS NULL THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Service request not found.';

    END IF;


    -- Request already accepted
    IF v_RequestStatus <> 'Pending' THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Service request is no longer available.';

    END IF;


    -- Calculate amounts
    SET v_PlatformFee =
        ROUND(v_Budget * v_PlatformFeePercent / 100, 2);

    SET v_TotalAmount =
        v_Budget + v_PlatformFee;

    SET v_AdvanceAmount =
        ROUND(v_TotalAmount * 30 / 100, 2);

    SET v_RemainingAmount =
        v_TotalAmount - v_AdvanceAmount;


    -- Mark request as Accepted FIRST
    UPDATE ServiceRequests
    SET
        RequestStatus = 'Accepted',
        UpdatedAt = NOW()
    WHERE RequestId = p_RequestId
      AND RequestStatus = 'Pending';


    -- Create Order
    INSERT INTO Orders
    (
        RequestId,
        CustomerId,
        ArtisanId,
        PlatformFeePercent,
        PlatformFee,
        TotalAmount,
        AdvanceAmount,
        RemainingAmount,
        OrderStatus,
        AcceptedAt,
        CreatedAt
    )
    VALUES
    (
        p_RequestId,
        v_CustomerId,
        v_ArtisanId,
        v_PlatformFeePercent,
        v_PlatformFee,
        v_TotalAmount,
        v_AdvanceAmount,
        v_RemainingAmount,
        'Created',
        NOW(),
        NOW()
    );

    SET v_OrderId = LAST_INSERT_ID();


    COMMIT;


    -- Return created order
    SELECT
        OrderId,
        RequestId,
        CustomerId,
        ArtisanId,
        PlatformFeePercent,
        PlatformFee,
        TotalAmount,
        AdvanceAmount,
        RemainingAmount,
        OrderStatus,
        AcceptedAt,
        CreatedAt
    FROM Orders
    WHERE OrderId = v_OrderId;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_CompleteWork;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_CompleteWork
(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN

    DECLARE v_ArtisanId INT;
    DECLARE v_RequestId INT;
    DECLARE v_OrderStatus VARCHAR(30);

    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    SELECT
        RequestId,
        OrderStatus
    INTO
        v_RequestId,
        v_OrderStatus
    FROM Orders
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId
    LIMIT 1;

    IF v_RequestId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order not found.';
    END IF;

    IF v_OrderStatus <> 'Started' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Work cannot be completed.';
    END IF;

    UPDATE Orders
    SET
        OrderStatus = 'Completed',
        CompletedAt = NOW()
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId;

    UPDATE ServiceRequests
    SET
        RequestStatus = 'WorkCompleted',
        UpdatedAt = NOW()
    WHERE RequestId = v_RequestId;

    SELECT
        OrderId,
        RequestId,
        CustomerId,
        ArtisanId,
        OrderStatus,
        AcceptedAt,
        StartedAt,
        CompletedAt,
        CreatedAt
    FROM Orders
    WHERE OrderId = p_OrderId;

END $$

DELIMITER ;

SELECT
    OrderId,
    RequestId,
    CustomerId,
    ArtisanId,
    OrderStatus
FROM Orders
ORDER BY OrderId DESC;
DROP PROCEDURE IF EXISTS sp_Artisan_CompleteWork;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_CompleteWork
(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN

    DECLARE v_ArtisanId INT;
    DECLARE v_RequestId INT;
    DECLARE v_OrderStatus VARCHAR(30);

    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    SELECT
        RequestId,
        OrderStatus
    INTO
        v_RequestId,
        v_OrderStatus
    FROM Orders
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId
    LIMIT 1;

    IF v_RequestId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order not found.';
    END IF;

    IF v_OrderStatus <> 'Started' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Work cannot be completed.';
    END IF;

    UPDATE Orders
    SET
        OrderStatus = 'Completed',
        CompletedAt = NOW()
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId;

    UPDATE ServiceRequests
    SET
        RequestStatus = 'WorkCompleted',
        UpdatedAt = NOW()
    WHERE RequestId = v_RequestId;

    SELECT
        OrderId,
        RequestId,
        CustomerId,
        ArtisanId,
        OrderStatus,
        AcceptedAt,
        StartedAt,
        CompletedAt,
        CreatedAt
    FROM Orders
    WHERE OrderId = p_OrderId;

END $$

DELIMITER ;
SELECT
    OrderId,
    RequestId,
    CustomerId,
    ArtisanId,
    OrderStatus
FROM Orders
ORDER BY OrderId DESC;
SELECT
    PaymentId,
    OrderId,
    PaymentType,
    Amount,
    PaymentStatus
FROM Payments
WHERE OrderId = 6
ORDER BY PaymentId;

DROP PROCEDURE IF EXISTS sp_Review_Create;

DELIMITER $$

CREATE PROCEDURE sp_Review_Create
(
    IN p_UserId INT,
    IN p_OrderId INT,
    IN p_Rating INT,
    IN p_Comment VARCHAR(500)
)
BEGIN

    DECLARE v_CustomerId INT;
    DECLARE v_ArtisanId INT;
    DECLARE v_OrderStatus VARCHAR(30);

    -- Get CustomerId from logged-in user
    SELECT CustomerId
    INTO v_CustomerId
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_CustomerId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    -- Validate rating
    IF p_Rating < 1 OR p_Rating > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5.';
    END IF;

    -- Get order details
    SELECT
        ArtisanId,
        OrderStatus
    INTO
        v_ArtisanId,
        v_OrderStatus
    FROM Orders
    WHERE OrderId = p_OrderId
      AND CustomerId = v_CustomerId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order not found.';
    END IF;

    -- Review only after completion
    IF v_OrderStatus <> 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Review can be added only after order completion.';
    END IF;

    -- One review per order
    IF EXISTS (
        SELECT 1
        FROM Reviews
        WHERE OrderId = p_OrderId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Review already exists for this order.';
    END IF;

    INSERT INTO Reviews
    (
        OrderId,
        CustomerId,
        ArtisanId,
        Rating,
        Comment,
        ReviewDate
    )
    VALUES
    (
        p_OrderId,
        v_CustomerId,
        v_ArtisanId,
        p_Rating,
        p_Comment,
        NOW()
    );

    SELECT
        ReviewId,
        OrderId,
        CustomerId,
        ArtisanId,
        Rating,
        Comment,
        ReviewDate
    FROM Reviews
    WHERE ReviewId = LAST_INSERT_ID();

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_GetAllForCustomer;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_GetAllForCustomer()
BEGIN

    SELECT
        ArtisanId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        PreviousWorkImages
    FROM Artisans
    WHERE IsApproved = TRUE
    ORDER BY CreatedAt DESC;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ServiceRequest_Create;

DELIMITER $$

CREATE PROCEDURE sp_ServiceRequest_Create
(
    IN p_UserId INT,
    IN p_ArtisanId INT,
    IN p_CategoryId INT,
    IN p_Description VARCHAR(2000),
    IN p_Size VARCHAR(50),
    IN p_NoOfFaces INT,
    IN p_SubjectImages VARCHAR(1000),
    IN p_Location VARCHAR(500),
    IN p_Budget DECIMAL(10,2),
    IN p_Deadline DATE,
    IN p_Instructions VARCHAR(2000)
)
BEGIN

    DECLARE v_CustomerId INT;

    SELECT CustomerId
    INTO v_CustomerId
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_CustomerId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Artisans a
        INNER JOIN Users u ON u.UserId = a.UserId
        WHERE a.ArtisanId = p_ArtisanId
          AND a.IsApproved = TRUE
          AND u.Role = 'Artisan'
          AND u.IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Selected artisan not found or inactive.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Categories
        WHERE CategoryId = p_CategoryId
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Category not found or inactive.';
    END IF;

    IF p_NoOfFaces <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Number of faces must be greater than zero.';
    END IF;

    IF p_Budget <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Budget must be greater than zero.';
    END IF;

    IF p_Deadline < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Deadline cannot be in the past.';
    END IF;

    INSERT INTO ServiceRequests
    (
        ArtisanId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt
    )
    VALUES
    (
        p_ArtisanId,
        v_CustomerId,
        p_CategoryId,
        p_Description,
        p_Size,
        p_NoOfFaces,
        p_SubjectImages,
        p_Location,
        p_Budget,
        p_Deadline,
        p_Instructions,
        'Pending',
        NOW()
    );

    SELECT
        RequestId,
        ArtisanId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt,
        UpdatedAt
    FROM ServiceRequests
    WHERE RequestId = LAST_INSERT_ID();

END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_ServiceRequest_Create;

DELIMITER $$

CREATE PROCEDURE sp_ServiceRequest_Create
(
    IN p_UserId INT,
    IN p_ArtisanId INT,
    IN p_CategoryId INT,
    IN p_Description VARCHAR(2000),
    IN p_Size VARCHAR(50),
    IN p_NoOfFaces INT,
    IN p_SubjectImages VARCHAR(1000),
    IN p_Location VARCHAR(500),
    IN p_Budget DECIMAL(10,2),
    IN p_Deadline DATE,
    IN p_Instructions VARCHAR(2000)
)
BEGIN

    DECLARE v_CustomerId INT;

    SELECT CustomerId
    INTO v_CustomerId
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_CustomerId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Artisans a
        INNER JOIN Users u ON u.UserId = a.UserId
        WHERE a.ArtisanId = p_ArtisanId
          AND a.IsApproved = TRUE
          AND u.Role = 'Artisan'
          AND u.IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Selected artisan not found or inactive.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Categories
        WHERE CategoryId = p_CategoryId
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Category not found or inactive.';
    END IF;

    IF p_NoOfFaces <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Number of faces must be greater than zero.';
    END IF;

    IF p_Budget <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Budget must be greater than zero.';
    END IF;

    IF p_Deadline < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Deadline cannot be in the past.';
    END IF;

    INSERT INTO ServiceRequests
    (
        ArtisanId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt
    )
    VALUES
    (
        p_ArtisanId,
        v_CustomerId,
        p_CategoryId,
        p_Description,
        p_Size,
        p_NoOfFaces,
        p_SubjectImages,
        p_Location,
        p_Budget,
        p_Deadline,
        p_Instructions,
        'Pending',
        NOW()
    );

    SELECT
        RequestId,
        ArtisanId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt,
        UpdatedAt
    FROM ServiceRequests
    WHERE RequestId = LAST_INSERT_ID();

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Category_GetAll;

DELIMITER $$

CREATE PROCEDURE sp_Category_GetAll()
BEGIN

    SELECT
        CategoryId,
        CategoryName,
        Description
    FROM Categories
    WHERE IsActive = TRUE
    ORDER BY CategoryName;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_GetAvailableRequests;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_GetAvailableRequests
(
    IN p_UserId INT
)
BEGIN

    DECLARE v_ArtisanId INT;

    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    SELECT
        sr.RequestId,
        sr.ArtisanId,
        sr.CustomerId,
        sr.CategoryId,
        c.CategoryName,
        sr.Description,
        sr.Size,
        sr.NoOfFaces,
        sr.SubjectImages,
        sr.Location,
        sr.Budget,
        sr.Deadline,
        sr.Instructions,
        sr.RequestStatus,
        sr.CreatedAt,
        sr.UpdatedAt

    FROM ServiceRequests sr

    INNER JOIN Categories c
        ON sr.CategoryId = c.CategoryId

    WHERE sr.ArtisanId = v_ArtisanId
      AND sr.RequestStatus = 'Pending'

    ORDER BY sr.CreatedAt DESC;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_AcceptRequest;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_AcceptRequest
(
    IN p_UserId INT,
    IN p_RequestId INT
)
BEGIN

    DECLARE v_ArtisanId INT;
    DECLARE v_CustomerId INT;
    DECLARE v_Budget DECIMAL(10,2);
    DECLARE v_RequestStatus VARCHAR(30);

    DECLARE v_PlatformFeePercent DECIMAL(5,2) DEFAULT 10.00;
    DECLARE v_PlatformFee DECIMAL(10,2);
    DECLARE v_TotalAmount DECIMAL(10,2);
    DECLARE v_AdvanceAmount DECIMAL(10,2);
    DECLARE v_RemainingAmount DECIMAL(10,2);

    DECLARE v_OrderId INT;

    START TRANSACTION;

    -- Get Artisan
    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';

    END IF;


    -- Lock and get request assigned to this Artisan
    SELECT
        CustomerId,
        Budget,
        RequestStatus
    INTO
        v_CustomerId,
        v_Budget,
        v_RequestStatus
    FROM ServiceRequests
    WHERE RequestId = p_RequestId
      AND ArtisanId = v_ArtisanId
    FOR UPDATE;


    -- Request not found or not assigned to this Artisan
    IF v_CustomerId IS NULL THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Service request not found or not assigned to this artisan.';

    END IF;


    -- Request already accepted
    IF v_RequestStatus <> 'Pending' THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Service request is no longer available.';

    END IF;


    -- Calculate amounts
    SET v_PlatformFee =
        ROUND(v_Budget * v_PlatformFeePercent / 100, 2);

    SET v_TotalAmount =
        v_Budget + v_PlatformFee;

    SET v_AdvanceAmount =
        ROUND(v_TotalAmount * 30 / 100, 2);

    SET v_RemainingAmount =
        v_TotalAmount - v_AdvanceAmount;


    -- Mark request as Accepted
    UPDATE ServiceRequests
    SET
        RequestStatus = 'Accepted',
        UpdatedAt = NOW()
    WHERE RequestId = p_RequestId
      AND ArtisanId = v_ArtisanId
      AND RequestStatus = 'Pending';


    -- Create Order
    INSERT INTO Orders
    (
        RequestId,
        CustomerId,
        ArtisanId,
        PlatformFeePercent,
        PlatformFee,
        TotalAmount,
        AdvanceAmount,
        RemainingAmount,
        OrderStatus,
        AcceptedAt,
        CreatedAt
    )
    VALUES
    (
        p_RequestId,
        v_CustomerId,
        v_ArtisanId,
        v_PlatformFeePercent,
        v_PlatformFee,
        v_TotalAmount,
        v_AdvanceAmount,
        v_RemainingAmount,
        'Created',
        NOW(),
        NOW()
    );

    SET v_OrderId = LAST_INSERT_ID();


    COMMIT;


    -- Return created order
    SELECT
        OrderId,
        RequestId,
        CustomerId,
        ArtisanId,
        PlatformFeePercent,
        PlatformFee,
        TotalAmount,
        AdvanceAmount,
        RemainingAmount,
        OrderStatus,
        AcceptedAt,
        CreatedAt
    FROM Orders
    WHERE OrderId = v_OrderId;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_RejectRequest;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_RejectRequest
(
    IN p_UserId INT,
    IN p_RequestId INT
)
BEGIN

    DECLARE v_ArtisanId INT;
    DECLARE v_RequestStatus VARCHAR(30);

    START TRANSACTION;

    -- Get Artisan
    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';

    END IF;


    -- Check assigned request
    SELECT RequestStatus
    INTO v_RequestStatus
    FROM ServiceRequests
    WHERE RequestId = p_RequestId
      AND ArtisanId = v_ArtisanId
    FOR UPDATE;


    -- Request not found
    IF v_RequestStatus IS NULL THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Service request not found or not assigned to this artisan.';

    END IF;


    -- Only Pending requests can be rejected
    IF v_RequestStatus <> 'Pending' THEN

        ROLLBACK;

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Service request is no longer available.';

    END IF;


    -- Reject request
    UPDATE ServiceRequests
    SET
        RequestStatus = 'Rejected',
        UpdatedAt = NOW()
    WHERE RequestId = p_RequestId
      AND ArtisanId = v_ArtisanId
      AND RequestStatus = 'Pending';


    COMMIT;


    -- Return updated request
    SELECT
        RequestId,
        ArtisanId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt,
        UpdatedAt
    FROM ServiceRequests
    WHERE RequestId = p_RequestId;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_UpdateProfile;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_UpdateProfile
(
    IN p_UserId INT,
    IN p_CompanyName VARCHAR(150),
    IN p_ExperienceYears INT,
    IN p_ServiceArea VARCHAR(200),
    IN p_Description VARCHAR(1000),
    IN p_PreviousWorkImages VARCHAR(2000)
)
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM Users
        WHERE UserId = p_UserId
          AND Role = 'Artisan'
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan user not found.';
    END IF;


    IF NOT EXISTS (
        SELECT 1
        FROM Artisans
        WHERE UserId = p_UserId
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;


    IF p_ExperienceYears IS NOT NULL
       AND p_ExperienceYears < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Experience years cannot be negative.';
    END IF;


    UPDATE Artisans
    SET
        CompanyName = p_CompanyName,
        ExperienceYears = p_ExperienceYears,
        ServiceArea = p_ServiceArea,
        Description = p_Description,
        PreviousWorkImages = p_PreviousWorkImages
    WHERE UserId = p_UserId;


    SELECT
        ArtisanId,
        UserId,
        CompanyName,
        ExperienceYears,
        ServiceArea,
        Description,
        PreviousWorkImages,
        IsApproved,
        CreatedAt
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_StartWork;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_StartWork
(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN
    DECLARE v_ArtisanId INT;
    DECLARE v_RequestId INT;
    DECLARE v_OrderStatus VARCHAR(30);

    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    SELECT
        RequestId,
        OrderStatus
    INTO
        v_RequestId,
        v_OrderStatus
    FROM Orders
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId
    LIMIT 1;

    IF v_RequestId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order not found.';
    END IF;

    IF v_OrderStatus <> 'Created' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order cannot be started.';
    END IF;

    -- Advance payment must be completed before work starts
    IF NOT EXISTS
    (
        SELECT 1
        FROM Payments
        WHERE OrderId = p_OrderId
          AND PaymentType = 'Advance'
          AND PaymentStatus = 'Success'
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Advance payment must be completed before starting work.';
    END IF;

    UPDATE Orders
    SET
        OrderStatus = 'Started',
        StartedAt = NOW()
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId;

    UPDATE ServiceRequests
    SET
        RequestStatus = 'WorkStarted',
        UpdatedAt = NOW()
    WHERE RequestId = v_RequestId;

    SELECT
        OrderId,
        RequestId,
        CustomerId,
        ArtisanId,
        OrderStatus,
        AcceptedAt,
        StartedAt,
        CreatedAt
    FROM Orders
    WHERE OrderId = p_OrderId;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Artisan_UploadArtwork;

DELIMITER $$

CREATE PROCEDURE sp_Artisan_UploadArtwork
(
    IN p_UserId INT,
    IN p_OrderId INT,
    IN p_ArtworkImages VARCHAR(2000)
)
BEGIN
    DECLARE v_ArtisanId INT;
    DECLARE v_OrderStatus VARCHAR(30);

    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    SELECT OrderStatus
    INTO v_OrderStatus
    FROM Orders
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId
    LIMIT 1;

    IF v_OrderStatus IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order not found.';
    END IF;

    IF v_OrderStatus <> 'Completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Artwork can be uploaded only after work is completed.';
    END IF;

    IF p_ArtworkImages IS NULL
       OR TRIM(p_ArtworkImages) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Artwork image URL is required.';
    END IF;

    UPDATE Orders
    SET ArtworkImages = TRIM(p_ArtworkImages)
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId;

    SELECT
        OrderId,
        RequestId,
        CustomerId,
        ArtisanId,
        PlatformFeePercent,
        PlatformFee,
        TotalAmount,
        AdvanceAmount,
        RemainingAmount,
        OrderStatus,
        AcceptedAt,
        StartedAt,
        CompletedAt,
        ArtworkImages,
        CreatedAt
    FROM Orders
    WHERE OrderId = p_OrderId
      AND ArtisanId = v_ArtisanId;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Order_GetArtisanOrderDetails;

DELIMITER $$

CREATE PROCEDURE sp_Order_GetArtisanOrderDetails(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN
    DECLARE v_ArtisanId INT;

    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    SELECT
        o.OrderId,
        o.RequestId,
        o.CustomerId,
        o.ArtisanId,
        o.PlatformFeePercent,
        o.PlatformFee,
        o.TotalAmount,
        o.AdvanceAmount,
        o.RemainingAmount,
        o.OrderStatus,
        o.AcceptedAt,
        o.StartedAt,
        o.CompletedAt,
        o.ArtworkImages,
        o.CreatedAt
    FROM Orders o
    WHERE o.OrderId = p_OrderId
      AND o.ArtisanId = v_ArtisanId
    LIMIT 1;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Order_GetCustomerOrderDetails;

DELIMITER $$

CREATE PROCEDURE sp_Order_GetCustomerOrderDetails(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN
    DECLARE v_CustomerId INT;

    SELECT CustomerId
    INTO v_CustomerId
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_CustomerId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    SELECT
        o.OrderId,
        o.RequestId,
        o.CustomerId,
        o.ArtisanId,
        o.PlatformFeePercent,
        o.PlatformFee,
        o.TotalAmount,
        o.AdvanceAmount,
        o.RemainingAmount,
        o.OrderStatus,
        o.AcceptedAt,
        o.StartedAt,
        o.CompletedAt,
        o.ArtworkImages,
        o.CreatedAt
    FROM Orders o
    WHERE o.OrderId = p_OrderId
      AND o.CustomerId = v_CustomerId
    LIMIT 1;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Order_GetCustomerOrderDetails;

DELIMITER $$

CREATE PROCEDURE sp_Order_GetCustomerOrderDetails(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN
    DECLARE v_CustomerId INT;

    SELECT CustomerId
    INTO v_CustomerId
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_CustomerId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    SELECT
        o.OrderId,
        o.RequestId,
        o.CustomerId,
        o.ArtisanId,
        o.PlatformFeePercent,
        o.PlatformFee,
        o.TotalAmount,
        o.AdvanceAmount,
        o.RemainingAmount,
        o.OrderStatus,
        o.AcceptedAt,
        o.StartedAt,
        o.CompletedAt,
        o.ArtworkImages,
        o.CreatedAt,

        CASE
            WHEN EXISTS (
                SELECT 1
                FROM Payments p
                WHERE p.OrderId = o.OrderId
                  AND p.PaymentType = 'Final'
                  AND p.PaymentStatus = 'Success'
            )
            THEN TRUE
            ELSE FALSE
        END AS IsFinalPaymentCompleted

    FROM Orders o
    WHERE o.OrderId = p_OrderId
      AND o.CustomerId = v_CustomerId
    LIMIT 1;

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_ServiceRequest_Create;

DELIMITER $$

CREATE PROCEDURE sp_ServiceRequest_Create
(
    IN p_UserId INT,
    IN p_ArtisanId INT,
    IN p_CategoryId INT,
    IN p_Description VARCHAR(2000),
    IN p_Size VARCHAR(50),
    IN p_NoOfFaces INT,
    IN p_SubjectImages VARCHAR(5000),
    IN p_Location VARCHAR(500),
    IN p_Budget DECIMAL(10,2),
    IN p_Deadline DATE,
    IN p_Instructions VARCHAR(2000)
)
BEGIN

    DECLARE v_CustomerId INT;

    SELECT CustomerId
    INTO v_CustomerId
    FROM Customers
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_CustomerId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer profile not found.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Artisans a
        INNER JOIN Users u
            ON u.UserId = a.UserId
        WHERE a.ArtisanId = p_ArtisanId
          AND a.IsApproved = TRUE
          AND u.Role = 'Artisan'
          AND u.IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Selected artisan not found or inactive.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM Categories
        WHERE CategoryId = p_CategoryId
          AND IsActive = TRUE
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Category not found or inactive.';
    END IF;

    IF p_NoOfFaces <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Number of faces must be greater than zero.';
    END IF;

    IF p_Budget <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Budget must be greater than zero.';
    END IF;

    IF p_Deadline < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
            'Deadline cannot be in the past.';
    END IF;

    INSERT INTO ServiceRequests
    (
        ArtisanId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt
    )
    VALUES
    (
        p_ArtisanId,
        v_CustomerId,
        p_CategoryId,
        p_Description,
        p_Size,
        p_NoOfFaces,
        p_SubjectImages,
        p_Location,
        p_Budget,
        p_Deadline,
        p_Instructions,
        'Pending',
        NOW()
    );

    SELECT
        RequestId,
        ArtisanId,
        CustomerId,
        CategoryId,
        Description,
        Size,
        NoOfFaces,
        SubjectImages,
        Location,
        Budget,
        Deadline,
        Instructions,
        RequestStatus,
        CreatedAt,
        UpdatedAt
    FROM ServiceRequests
    WHERE RequestId = LAST_INSERT_ID();

END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Order_GetCustomerOrderDetails;

DELIMITER $$

CREATE PROCEDURE sp_Order_GetCustomerOrderDetails
(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN

    SELECT
        o.OrderId,
        o.RequestId,
        o.CustomerId,
        o.ArtisanId,

        o.PlatformFeePercent,
        o.PlatformFee,
        o.TotalAmount,
        o.AdvanceAmount,
        o.RemainingAmount,

        o.OrderStatus,

        o.AcceptedAt,
        o.StartedAt,
        o.CompletedAt,

        -- Customer reference images
        sr.SubjectImages,

        -- Final artwork images
        o.ArtworkImages,

        -- Final payment status
        CASE
            WHEN EXISTS
            (
                SELECT 1
                FROM Payments p
                WHERE p.OrderId = o.OrderId
                  AND p.PaymentType = 'Final'
                  AND p.PaymentStatus = 'Success'
            )
            THEN TRUE
            ELSE FALSE
        END AS IsFinalPaymentCompleted,

        o.CreatedAt

    FROM Orders o

    INNER JOIN ServiceRequests sr
        ON sr.RequestId = o.RequestId

    INNER JOIN Customers c
        ON c.CustomerId = o.CustomerId

    WHERE o.OrderId = p_OrderId
      AND c.UserId = p_UserId

    LIMIT 1;

END $$

DELIMITER ;

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Order_GetArtisanOrderDetails;

DELIMITER $$

CREATE PROCEDURE sp_Order_GetArtisanOrderDetails(
    IN p_UserId INT,
    IN p_OrderId INT
)
BEGIN
    DECLARE v_ArtisanId INT;

    SELECT ArtisanId
    INTO v_ArtisanId
    FROM Artisans
    WHERE UserId = p_UserId
    LIMIT 1;

    IF v_ArtisanId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artisan profile not found.';
    END IF;

    SELECT
        o.OrderId,
        o.RequestId,
        o.CustomerId,
        o.ArtisanId,
        o.PlatformFeePercent,
        o.PlatformFee,
        o.TotalAmount,
        o.AdvanceAmount,
        o.RemainingAmount,
        o.OrderStatus,
        o.AcceptedAt,
        o.StartedAt,
        o.CompletedAt,

        sr.SubjectImages,

        o.ArtworkImages,
        o.CreatedAt

    FROM Orders o

    INNER JOIN ServiceRequests sr
        ON sr.RequestId = o.RequestId

    WHERE o.OrderId = p_OrderId
      AND o.ArtisanId = v_ArtisanId

    LIMIT 1;

END $$

DELIMITER ;