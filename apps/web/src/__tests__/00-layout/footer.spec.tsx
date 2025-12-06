import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders without crashing", () => {
    render(<Footer />);
  });

  it("displays the company description text", () => {
    render(<Footer />);
    const elements = screen.getAllByText(
      /Contrary to popular belief, Lorem Ipsum is not simply random text/i
    );
    expect(elements.length).toBeGreaterThan(0);
  });

  it("renders all page links", () => {
    render(<Footer />);

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("College Admission")).toBeTruthy();
    expect(screen.getByText("Blog")).toBeTruthy();
    expect(screen.getByText("About Us")).toBeTruthy();
    expect(screen.getByText("Contact Us")).toBeTruthy();
    expect(screen.getByText("StudeBook")).toBeTruthy();
  });

  it("renders all useful links", () => {
    render(<Footer />);

    expect(screen.getByText("Terms of Service")).toBeTruthy();
    expect(screen.getByText("Privacy policy")).toBeTruthy();
    expect(screen.getByText("Become an affiliate partner")).toBeTruthy();
    expect(screen.getByText("Become an Instructor")).toBeTruthy();
    expect(screen.getByText(/You can earn a up to\s*\$200/i)).toBeTruthy();
  });

  it("renders all social media links", () => {
    render(<Footer />);

    expect(screen.getByText("Bluesky")).toBeTruthy();
    expect(screen.getByText("Facebook")).toBeTruthy();
    expect(screen.getByText("Instagram")).toBeTruthy();
    expect(screen.getByText("LinkedIn")).toBeTruthy();
    expect(screen.getByText("Twitter")).toBeTruthy();
    expect(screen.getByText("TikTok")).toBeTruthy();
    expect(screen.getByText("YouTube")).toBeTruthy();
  });

  it("displays section headers", () => {
    render(<Footer />);

    expect(screen.getByText("PAGES")).toBeTruthy();
    expect(screen.getByText("USEFUL LINKS")).toBeTruthy();
    expect(screen.getByText("FOLLOW US")).toBeTruthy();
  });

  it("renders copyright notice", () => {
    render(<Footer />);
    const copyright = screen.getByText(
      /Prepexcellence\.com 2021-2025\. All Rights Reserved/i
    );
    expect(copyright).toBeTruthy();
  });

  it("displays SAT trademark disclaimer", () => {
    render(<Footer />);
    const disclaimer = screen.getByText(
      /SAT.*registered trademark of the College Board/i
    );
    expect(disclaimer).toBeTruthy();
  });

  it("renders footer element with correct semantic HTML", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
  });
});
