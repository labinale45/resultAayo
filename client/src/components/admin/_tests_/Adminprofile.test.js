
import { render, screen } from "@testing-library/react";
import Adminprofile from "../Adminprofile";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />, // Replace Image with <img>
}));

describe("Adminprofile Component", () => {
  it("should render profile data from API call (mocked)", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    render(<Adminprofile />);

    // Verify the default profile data is rendered
    expect(screen.getByText("Name:")).toBeVisible();
    expect(screen.getByText("Admin User")).toBeVisible();

    expect(screen.getByText("Email:")).toBeVisible();
    expect(screen.getByText("admin123@gmail.com")).toBeVisible();

    expect(screen.getByText("Phone:")).toBeVisible();
    expect(screen.getByText("9824104129")).toBeVisible();

    expect(screen.getByText("Join Date:")).toBeVisible();
    expect(screen.getByText("2023-01-01")).toBeVisible();
  });
  it("should render the admin avatar image", () => {
    render(<Adminprofile />);
  
    const avatarImage = screen.getByAltText("Admin Avatar");
    expect(avatarImage).toBeVisible();
    expect(avatarImage).toHaveAttribute("src", "/assets/Rabin.jpg");
    expect(avatarImage).toHaveAttribute("width", "150");
    expect(avatarImage).toHaveAttribute("height", "150");
  });
  it("should display the Admin Profile header", () => {
    render(<Adminprofile />);
  
    const header = screen.getByText("Admin Profile");
    expect(header).toBeVisible();
    expect(header).toHaveClass("text-2xl font-bold mb-6 text-center");
  });
  it("should render a close button with proper attributes", () => {
    render(<Adminprofile />);
  
    const closeButton = screen.getByRole("button", { name: "" }); // No accessible name
    expect(closeButton).toBeVisible();
    expect(closeButton).toHaveClass("absolute top-2 right-2 text-red-500 hover:text-red-700");
  });
  it("should render all profile field labels", () => {
    render(<Adminprofile />);
  
    const labels = ["Name:", "Email:", "Phone:", "Join Date:"];
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });
  });
  it("should display the default profile values correctly", () => {
    render(<Adminprofile />);
  
    const defaultValues = {
      "Name:": "Admin User",
      "Email:": "admin123@gmail.com",
      "Phone:": "9824104129",
      "Join Date:": "2023-01-01",
    };
  
    Object.entries(defaultValues).forEach(([label, value]) => {
      expect(screen.getByText(label)).toBeVisible();
      expect(screen.getByText(value)).toBeVisible();
    });
  });
  it("should render profile fields in a column layout", () => {
    render(<Adminprofile />);
  
    const profileFields = screen.getAllByText(/:/); // Matches "Name:", "Email:", etc.
    profileFields.forEach((field) => {
      expect(field).toBeVisible();
      expect(field.parentElement).toHaveClass("flex items-center mb-4");
    });
  });
  
  it("should render the admin avatar image", () => {
    render(<Adminprofile />);

    const avatarImage = screen.getByAltText("Admin Avatar");
    expect(avatarImage).toBeVisible();
    expect(avatarImage).toHaveAttribute("src", "/assets/Rabin.jpg");
    expect(avatarImage).toHaveAttribute("width", "150");
    expect(avatarImage).toHaveAttribute("height", "150");
  });
});
