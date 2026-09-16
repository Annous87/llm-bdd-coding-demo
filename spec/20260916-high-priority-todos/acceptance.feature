Feature: Manage high-priority todo items
  As a todo app user
  I want to mark items as high priority
  So that I can identify urgent tasks and act on them first

  Background:
    Given the Todo application is open

  Scenario: Create a normal-priority todo
    When I add a todo with text "Buy groceries" without enabling high priority
    Then the todo "Buy groceries" appears in the list
    And the todo "Buy groceries" is shown as normal priority

  Scenario: Create a high-priority todo
    When I add a todo with text "Pay rent" with high priority enabled
    Then the todo "Pay rent" appears in the list
    And the todo "Pay rent" is shown as high priority
    And the todo "Pay rent" is visually distinguishable from normal-priority todos

  Scenario: High-priority todos are ordered above normal todos
    Given the list contains the normal-priority todos "Task A" and "Task B"
    And the list contains the high-priority todo "Task C"
    When the list is displayed
    Then "Task C" appears above "Task A"
    And "Task C" appears above "Task B"

  Scenario: Preserve relative order within the same priority group
    Given I add high-priority todo "Urgent 1"
    And I add high-priority todo "Urgent 2"
    And I add normal-priority todo "Normal 1"
    And I add normal-priority todo "Normal 2"
    When the list is displayed
    Then "Urgent 1" appears above "Urgent 2"
    And "Normal 1" appears above "Normal 2"

  Scenario: Update an existing todo from normal to high priority
    Given the list contains a normal-priority todo "Send report"
    When I mark "Send report" as high priority
    Then "Send report" is shown as high priority
    And "Send report" appears above all normal-priority todos

  Scenario: Remove high priority from an existing todo
    Given the list contains a high-priority todo "Call support"
    When I remove high priority from "Call support"
    Then "Call support" is shown as normal priority
    And "Call support" is visually the same priority style as other normal-priority todos

  Scenario: Persist priority after refresh
    Given the list contains a high-priority todo "Book flight"
    And the list contains a normal-priority todo "Clean desk"
    When I refresh the page
    Then "Book flight" remains high priority
    And "Clean desk" remains normal priority
    And "Book flight" appears above "Clean desk"

  Scenario: Support many high-priority items without a limit
    Given I add multiple todos as high priority
    When the list is displayed
    Then all of those todos are retained as high priority
    And all high-priority todos appear above normal-priority todos

  Scenario: Empty-state behavior remains unchanged
    Given there are no todos
    When I view the list
    Then the existing empty-state behavior is shown
