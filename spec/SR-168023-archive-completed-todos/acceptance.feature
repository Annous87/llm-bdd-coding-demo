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
