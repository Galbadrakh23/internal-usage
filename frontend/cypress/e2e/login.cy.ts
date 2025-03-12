describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    // Clear cookies before each test
    cy.clearCookies();
  });

  it("displays the login form with all elements", () => {
    cy.get('img[alt="Company logo"]').should("be.visible");
    cy.get("form").within(() => {
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });
  });

  it("shows validation error when fields are empty", () => {
    cy.get('button[type="submit"]').click();
    cy.get(".text-red-500").should("be.visible");
    cy.get(".text-red-500").should("contain", "Please fill in all fields.");
  });

  it("handles invalid login credentials", () => {
    cy.get('input[type="email"]').type("invalid@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();
    cy.get(".text-red-500").should("be.visible");
  });

  it("successfully logs in with valid credentials", () => {
    // Replace with valid test credentials
    const validEmail = "galbadrakh223@gmail.com";
    const validPassword = "Mm123123";

    // Intercept the login API call
    cy.intercept("POST", "**/api/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
      },
    }).as("loginRequest");

    // Intercept the user data fetch that happens after login
    cy.intercept("GET", "**/api/user", {
      statusCode: 200,
      body: {
        name: "Test User",
        email: validEmail,
      },
    }).as("getUserRequest");

    cy.get('input[type="email"]').type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait("@loginRequest");

    // Verify redirect to dashboard
    cy.url().should("include", "/dashboard");

    // Verify the success toast appears
    cy.contains("Login successful!").should("be.visible");
  });

  it("shows loading state during login attempt", () => {
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password");

    // Intercept the login request with a delay
    cy.intercept("POST", "**/api/login", (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: { token: "fake-jwt-token" },
      });
    }).as("delayedLogin");

    cy.get('button[type="submit"]').click();

    // Verify loading state
    cy.get('button[type="submit"]').should("be.disabled");
    cy.get('button[type="submit"]').should("contain", "Түр хүлээнэ үү...");
  });
});
