@SR-167889
Feature: Filter todos by completion status
  As a user of the Todo application
  I want to filter my todos by completion status
  So that I can focus on either outstanding or completed tasks

  Background:
    Given the Todo application contains active and completed todos

  Scenario: Default filter on application open
    When I open the application
    Then the "All" filter is selected
    And all todos are displayed

  Scenario: Show only active todos
    Given the Todo application contains:
      | Todo                 | Status    |
      | Prepare presentation | Active    |
      | Send email           | Completed |
    When I select the "Active" filter
    Then "Prepare presentation" is displayed
    And "Send email" is not displayed

  Scenario: Show only completed todos
    Given the Todo application contains:
      | Todo                 | Status    |
      | Prepare presentation | Active    |
      | Send email           | Completed |
    When I select the "Completed" filter
    Then "Send email" is displayed
    And "Prepare presentation" is not displayed

  Scenario: Return to all todos
    Given I have selected the "Active" filter
    And the Todo application contains active and completed todos
    When I select the "All" filter
    Then active and completed todos are displayed

  Scenario: Changing filters does not modify todos
    Given the Todo application contains active and completed todos
    When I change between "All", "Active", and "Completed" filters
    Then no todo is deleted
    And no todo completion status is changed

  Scenario: Empty result for selected filter
    Given all existing todos are completed
    When I select the "Active" filter
    Then no todo items are displayed
    And the application remains usable

  Scenario: Active filter preserves priority ordering
    Given there are multiple active todos
    And some active todos are high priority
    When I select the "Active" filter
    Then only active todos are displayed
    And high-priority active todos remain ordered before normal-priority active todos
