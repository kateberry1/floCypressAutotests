import EventPage from "../support/eventPage";
const eventPage = new EventPage();
const eventId = 12932757;

// This hook runs before each test to ensure a consistent starting point
beforeEach(() => {
  cy.visit(`/events/${eventId}-2025-eiwa-championship`);
  cy.url().should("include", `/events/${eventId}-2025-eiwa-championship`);
});

// Basic sanity checks on initial page content
describe("Basic Page Load and UI Checks", () => {
  it("Verify the page loads correctly", () => {
    cy.title().should("contain", "2025 EIWA Championship");
    eventPage.eventPageHeaderSummaryContain("Mar 7-8");
    eventPage.eventPageImageBanner().should("be.visible");
  });
});

// Test navigation across all major tabs (Results, Videos, News, Schedule)
describe("Navigation & Tab Validation", () => {
  it("Verify key navigation links", () => {
    eventPage.eventPageNavigateToTab("results", eventId);
    eventPage.eventPageMainContainerContain("Results");

    eventPage.eventPageNavigateToTab("videos", eventId);
    eventPage.eventPageMainContainerContain("Videos");
    eventPage.eventPageVideoCardsGrid().should("be.visible");

    eventPage.eventPageNavigateToTab("news", eventId);
    eventPage.eventPageMainContainerContain("News");
    eventPage.eventPageContainsNewsCards();

    eventPage.eventPageNavigateToTab("schedule", eventId);
    eventPage.eventPageMainContainerContain("Schedule");
    eventPage.eventPageScheduleCardAvailable(eventId);
  });
});

// Check filtering behavior for team, weight class, round, and reset
describe("Event Filters Testing", () => {
  it("Test filtering by team", () => {
    eventPage.eventPageSelectRandomDropdownValue("team");
    cy.get("@selectedDropdownValue").then((dropdownValue) => {
      eventPage
        .eventPageResultCard()
        .should("have.length.at.least", 1)
        .each(($card) => {
          cy.wrap($card).invoke("text").should("include", dropdownValue);
        });
    });
  });

  it("Test filtering by weight class", () => {
    eventPage.eventPageSelectRandomDropdownValue("weightClass");
    cy.get("@selectedDropdownValue").then((dropdownValue) => {
      eventPage
        .eventPageResultWeightLabel()
        .should("have.length.at.least", 1)
        .each(($card) => {
          cy.wrap($card).invoke("text").should("include", dropdownValue);
        });
    });
  });

  it("Test filtering by weight round", () => {
    eventPage.eventPageSelectRandomDropdownValue("round");
    cy.get("@selectedDropdownValue").then((dropdownValue) => {
      eventPage.eventPageResultRoundLabelContain(dropdownValue);
    });
  });

  it("Test resetting filters", () => {
    // Capture initial number of result cards before applying filters
    eventPage
      .eventPageResultCard()
      .then(($items) => $items.length)
      .as("totalBeforeFilter");

    // Apply and verify each filter one by one
    eventPage.eventPageSelectRandomDropdownValue("round");
    cy.get("@selectedDropdownValue").then((dropdownValue) => {
      eventPage.eventPageResultRoundLabelContain(dropdownValue);
    });

    cy.get("@totalBeforeFilter").then((totalBefore) => {
      eventPage
        .eventPageResultCard()
        .its("length")
        .should("be.lt", totalBefore);
    });

    eventPage.eventPageSelectRandomDropdownValue("team");
    cy.get("@selectedDropdownValue").then((dropdownValue) => {
      eventPage
        .eventPageResultCard()
        .should("have.length.at.least", 1)
        .each(($card) => {
          cy.wrap($card).invoke("text").should("include", dropdownValue);
        });
    });

    cy.get("@totalBeforeFilter").then((totalBefore) => {
      eventPage
        .eventPageResultCard()
        .its("length")
        .should("be.lt", totalBefore);
    });

    eventPage.eventPageSelectRandomDropdownValue("weightClass");
    cy.get("@selectedDropdownValue").then((dropdownValue) => {
      eventPage
        .eventPageResultWeightLabel()
        .should("have.length.at.least", 1)
        .each(($card) => {
          cy.wrap($card).invoke("text").should("include", dropdownValue);
        });
    });

    cy.get("@totalBeforeFilter").then((totalBefore) => {
      eventPage
        .eventPageResultCard()
        .its("length")
        .should("be.lt", totalBefore);
    });

    // Clear all filters and confirm that original state is restored
    eventPage.clickEventPageResultClealAllFiltersButton();
    cy.url().should("not.include", "teamName");
    cy.url().should("not.include", "weightClassName");
    cy.url().should("not.include", "roundName");

    cy.get("@totalBeforeFilter").then((totalBefore) => {
      eventPage.eventPageResultCard().its("length").should("eq", totalBefore);
    });
  });
});

// Tests search field and its result behavior
describe("Search Functionality", () => {
  it("Test search input", () => {
    cy.get(".d-md-flex.w-competitor-detail__name")
      .should("have.length.greaterThan", 1)
      .then(($els) => {
        const names = [...$els]
          .map((el) => el.innerText.trim())
          .filter(Boolean);
        const randomName = names[Math.floor(Math.random() * names.length)];
        cy.log(`Random name selected: ${randomName}`);

        // Search for selected wrestler and validate results
        eventPage.eventPageSearchInputFieldTypeTextAndSearch(randomName);
        eventPage
          .eventPageResultCard()
          .should("have.length.at.least", 1)
          .each(($card) => {
            cy.wrap($card).invoke("text").should("include", randomName);
          });
      });
  });

  it("Test no results behavior", () => {
    // Search for a non-existent wrestler
    eventPage.eventPageSearchInputFieldTypeTextAndSearch("Random Wrestler");

    // Verify 'no results' UI elements
    eventPage.eventPageSearchNoResultsTextLabelContain("Random Wrestler");
    eventPage.eventPageSearchNoResultsUpperTextContain(
      "We couldn't find any results for"
    );
    eventPage.eventPageSearchNoResultsDownTextContain(
      "Check your spelling, try different keywords, or adjust your filters."
    );
  });
});

// Validate video cards and playback interaction
describe("Test Video Streaming", () => {
  it("Ensure the live stream or videos page load correctly", () => {
    cy.title().should("contain", "2025 EIWA Championship");
    eventPage.eventPageHeaderSummaryContain("Mar 7-8");
    eventPage.eventPageImageBanner().should("be.visible");
    eventPage.eventPageResultMatchReplayLink().first().click();
    eventPage.eventPageVideoPreviewImage().should("be.visible");
  });

  it("Ensure the live stream or videos page can be played correctly", () => {
    cy.title().should("contain", "2025 EIWA Championship");
    eventPage.eventPageHeaderSummaryContain("Mar 7-8");
    eventPage.eventPageImageBanner().should("be.visible");

    eventPage.eventPageNavigateToTab("videos", eventId);
    eventPage.eventPageMainContainerContain("Videos");
    eventPage.eventPageVideoCardsGrid().should("be.visible");

    // Play the first video and check if playback progresses
    eventPage.eventPageVideoCard().first().click();
    eventPage.eventPageVideoControlsPanel().should("be.visible");

    cy.get(".current-time")
      .invoke("attr", "style")
      .then((styleBefore) => {
        cy.wait(2000);
        cy.get(".current-time")
          .invoke("attr", "style")
          .should((styleAfter) => {
            expect(styleAfter).to.not.equal(styleBefore); // playback time changed
          });
      });
  });
});
