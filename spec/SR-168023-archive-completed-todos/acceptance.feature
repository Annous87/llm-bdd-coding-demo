@SR-168023
Feature: Archive completed todos
  As a user
  I want to archive completed todos
  So that I can keep my todo list clean

  Background:
    Given the Todo application is open

  Scenario: Bulk archive action removes completed todos from the main list
    Given the todo list contains active and completed todos
    When I activate the bulk archive action for completed todos
    Then all completed todos are removed from the main todo list
    And all active todos remain unchanged

  Scenario: Archived todos are available in a separate archived view
    Given the todo list contains active and completed todos
    When I activate the bulk archive action for completed todos
    And I open the archived-todos view
    Then the archived completed todos are displayed in the archived-todos view
    And active todos are not displayed in the archived-todos view
