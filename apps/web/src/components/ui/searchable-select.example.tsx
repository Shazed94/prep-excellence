/**
 * SearchableSelect Component - Usage Examples
 * 
 * A reusable searchable select component built with shadcn/ui Command component.
 * Features: searching, keyboard navigation, and consistent styling.
 */

import { useState } from "react";
import { SearchableSelect } from "./searchable-select";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";

// Example 1: Simple string array
export function SimpleExample() {
  const [value, setValue] = useState("");
  const options = ["SAT", "ACT", "GRE", "GMAT", "TOEFL"];

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select test type"
      searchPlaceholder="Search test types..."
      emptyText="No test type found."
    />
  );
}

// Example 2: With react-hook-form
export function FormExample() {
  const form = useForm({
    defaultValues: {
      testType: "",
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="testType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Type</FormLabel>
            <FormControl>
              <SearchableSelect
                options={["SAT", "ACT", "GRE", "GMAT", "TOEFL"]}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select test type"
                searchPlaceholder="Search test types..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

// Example 3: With custom value/label objects
export function ObjectOptionsExample() {
  const [value, setValue] = useState("");
  const options = [
    { value: "sat", label: "SAT (Scholastic Assessment Test)" },
    { value: "act", label: "ACT (American College Testing)" },
    { value: "gre", label: "GRE (Graduate Record Examination)" },
    { value: "gmat", label: "GMAT (Graduate Management Admission Test)" },
  ];

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Select a test"
      searchPlaceholder="Search tests..."
    />
  );
}

// Example 4: Disabled state
export function DisabledExample() {
  return (
    <SearchableSelect
      options={["Option 1", "Option 2", "Option 3"]}
      value=""
      placeholder="Cannot select (disabled)"
      disabled={true}
    />
  );
}

// Example 5: With custom styling
export function CustomStyleExample() {
  const [value, setValue] = useState("");

  return (
    <SearchableSelect
      options={["Small", "Medium", "Large"]}
      value={value}
      onValueChange={setValue}
      placeholder="Select size"
      className="max-w-xs border-2 border-primary"
    />
  );
}
