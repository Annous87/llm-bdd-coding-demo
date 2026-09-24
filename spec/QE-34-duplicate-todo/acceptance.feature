@QE-34
Feature: Duplicate an existing Todo
  As a user
  I want to duplicate a Todo
  So that I can quickly create a similar task

  Scenario: Duplicate a todo from the list
    Given a Todo exists with title "Pay invoice" and priority "High"
    And that Todo is completed
    When I double click that Todo item
    Then a duplicated Todo is added at the top of the list
    And the duplicated Todo title is "Pay invoice"
    And the duplicated Todo priority is "High"
    And the duplicated Todo is active
