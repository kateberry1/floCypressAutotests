export default class EventPage {
  // -------- Locators --------
  eventPageHeaderSummary = () => cy.get('[data-test="header-summary"]');
  eventPageImageBanner = () => cy.get('[data-test="image"]');
  eventPageMainContainer = () =>
    cy.get('[data-test="entity-hub-main-content"]');
  eventPageVideoCardsGrid = () => cy.get(".card-grid");
  eventPageNewsCard = () => cy.get('[data-test="static-content-card"]');
  eventPageResultCard = () => cy.get(".w-result-card");
  eventPageResultWeightLabel = () => cy.get(".img-overlay-badge .color-500");
  eventPageResultRoundLabel = () =>
    cy.get('[data-test="entity-hub-main-content"] .h5');
  eventPageResultClealAllFiltersButton = () =>
    cy.get('[data-test="event-clear-all-filters-bff"]');
  eventPageSearchInputField = () => cy.get('[data-test="search-input"]');
  eventPageSearchNoResultsTextLabel = () =>
    cy.get('[data-test="no-results-text"]');
  eventPageSearchNoResultsUpperText = () => cy.get("span.headline");
  eventPageSearchNoResultsDownText = () => cy.get("p.headline");
  eventPageResultMatchReplayLink = () =>
    cy.get('[data-test="wrestling-match-replay-link"]');
  eventPageVideoPreviewImage = () => cy.get(".poster");
  eventPageVideoCard = () => cy.get(".small-content-card");
  eventPageVideoControlsPanel = () => cy.get(".video-player-controls");
  eventPageVideoCurrentTimeProgressBar = () => cy.get(".current-time");

  // -------- Methods / Actions --------

  // Verifies that video is playing by checking if progress bar style changes
  eventPageCheckVideoIsPlaying() {
    this.eventPageVideoCurrentTimeProgressBar()
      .invoke("attr", "style")
      .then((styleBefore) => {
        cy.wait(2000);
        this.eventPageVideoCurrentTimeProgressBar()
          .invoke("attr", "style")
          .should((styleAfter) => {
            expect(styleAfter).to.not.equal(styleBefore);
          });
      });
  }

  // Asserts bottom "no results" message contains given text
  eventPageSearchNoResultsDownTextContain(text) {
    this.eventPageSearchNoResultsDownText().should("contain", text);
  }

  // Asserts upper "no results" message contains given text
  eventPageSearchNoResultsUpperTextContain(text) {
    this.eventPageSearchNoResultsUpperText().should("contain", text);
  }

  // Asserts label next to search field contains the entered value
  eventPageSearchNoResultsTextLabelContain(text) {
    this.eventPageSearchNoResultsTextLabel().should("contain", text);
  }

  // Types text into the search input, triggers search, waits for loading to complete
  eventPageSearchInputFieldTypeTextAndSearch(text) {
    cy.wait(500); // Ensure field is fully rendered
    this.eventPageSearchInputField()
      .should("be.visible")
      .and("have.attr", "placeholder", "Search")
      .type(text, { delay: 0 })
      .should("have.value", text);
    cy.url().should("include", "search=");
    cy.get(".spinner-border", { timeout: 10000 }).should("not.exist");
  }

  // Clicks the Clear All button to reset filters
  clickEventPageResultClealAllFiltersButton() {
    this.eventPageResultClealAllFiltersButton().should("be.visible").click();
  }

  // Validates the round label text matches the selected filter
  eventPageResultRoundLabelContain(text) {
    this.eventPageResultRoundLabel().should("have.text", text);
  }

  // Verifies that the schedule block is visible
  eventPageScheduleCardAvailable(eventId) {
    cy.get(`[id="html-${eventId}"]`).should("be.visible");
  }

  // Ensures at least one news card is visible
  eventPageContainsNewsCards() {
    this.eventPageNewsCard().its("length").should("be.greaterThan", 0);
  }

  // Validates the main container contains expected text (used in tab content)
  eventPageMainContainerContain(text) {
    this.eventPageMainContainer().should("be.visible").and("contain", text);
  }

  // Validates the header summary (e.g., event date) contains expected text
  eventPageHeaderSummaryContain(text) {
    this.eventPageHeaderSummary().should("be.visible").and("contain", text);
  }

  // Navigates to a given event tab (e.g., results, videos, news, etc.)
  eventPageNavigateToTab(tab, eventId) {
    cy.get(`#${tab}-${eventId}`).click();
    cy.url().should("include", tab);
  }

  // Randomly selects a value from a dropdown filter (team, round, weight class)
  // Stores selected value in @selectedDropdownValue
  eventPageSelectRandomDropdownValue(filter) {
    cy.get(`#filter-${filter}Name`).click();
    cy.get(`#filter-${filter}Name [data-test="dropdown-option"]`)
      .should("have.length.at.least", 1)
      .then(($options) => {
        const optionCount = $options.length;
        const randomIndex = Math.floor(Math.random() * optionCount);
        const selectedOption = $options[randomIndex];
        const selectedDropdownValue = selectedOption.innerText.trim();
        cy.wrap(selectedDropdownValue).as("selectedDropdownValue");
        cy.wrap(selectedOption).click();
        cy.url().should("include", `${filter}Name`);
      });
  }
}
