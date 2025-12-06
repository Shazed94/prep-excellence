import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../../components/Header";

// Mock the TanStack Router to avoid RouterProvider requirement
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useRouter: () => ({}),
  useRouterState: () => ({}),
}));

function renderHeader() {
  return render(<Header />);
}

describe("Header", () => {
  it("renders logo", () => {
    renderHeader();

    const logo = screen.getByAltText(/PrepExcellence Logo/i);
    expect(logo).toBeTruthy();
  });

  it("renders all navigation links", () => {
    renderHeader();

    const links = [
      "Home",
      "SAT Courses",
      "College Admissions",
      "Blog",
      "About Us",
      "Contact Us",
    ];

    links.forEach((text) => {
      const elements = screen.getAllByText(text);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("opens login popup when login button clicked", () => {
    renderHeader();

    const login = screen.getAllByRole("button", { name: /login/i })[0];

    fireEvent.click(login);

    // we expect popup to show something containing Login text
    expect(screen.getByText(/login/i)).toBeTruthy();
  });

  it("opens mobile menu", () => {
    renderHeader();

    const menuButton = screen.getByRole("button", { name: /open menu/i });

    fireEvent.click(menuButton);

    // Check that mobile menu items are visible (there should be multiple "About Us" now)
    const aboutUsLinks = screen.getAllByText("About Us");
    expect(aboutUsLinks.length).toBeGreaterThan(1); // One in desktop, one in mobile
  });
});
