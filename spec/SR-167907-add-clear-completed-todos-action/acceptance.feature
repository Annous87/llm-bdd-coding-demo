@SR-167907
Feature: Clear completed todo items
  As a user of the Todo application
  I want to remove all completed todos with one action
  So that I can clean up my todo list without deleting completed items individually

  Background:
    Given the Todo application is open

  Scenario: Clear completed action hidden when no completed todos exist
    Given the todo list contains only active todos
    When the application is displayed
    Then the "Clear completed" action is not visible

  Scenario: Clear completed action visible when completed todo exists
    Given the todo list contains at least one completed todo
    When the application is displayed
    Then the "Clear completed" action is visible

  Scenario: Clear completed removes only completed todos
    Given the todo list contains active and completed todos
    When I activate the "Clear completed" action
    Then all completed todos are removed
    And all active todos remain

  Scenario: Clearing completed preserves active todo priority values
    Given active todos have different priority values
    And completed todos also exist
    When I activate the "Clear completed" action
    Then the active todos retain their existing priority values

  Scenario: Cleared state persists after reload
    Given completed todos have been removed using "Clear completed"
    When I reload the application
    Then removed completed todos do not reappear
    And remaining active todos are still present

  Scenario: Clear completed action disappears after clearing all completed items
    Given completed todos exist
    When I activate the "Clear completed" action
    And no completed todos remain
    Then the "Clear completed" action is no longer visible
