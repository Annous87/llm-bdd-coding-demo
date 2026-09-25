@QE-37
Feature: Duplicate an existing Todo
  As a user
  I want to duplicate a Todo
  So that I can quickly create a similar task

  Scenario: Duplicate a todo from a list item
    Given a Todo item exists with title "Pay invoice" and priority "High"
    And the Todo item is completed
    When I double click that Todo item
    Then a duplicated Todo item is added at the top of the list
    And the duplicated Todo has title "Pay invoice"
    And the duplicated Todo has priority "High"
    And the duplicated Todo is active
