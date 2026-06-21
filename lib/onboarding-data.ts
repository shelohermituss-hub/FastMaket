export interface OnboardingSlide {
  id: number;
  tag: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  bgType: "gradient" | "light";
  gradientFrom: string;
  gradientTo: string;
  cardType: "blue" | "orange" | "stack";
  imageAsset: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    tag: "News For You",
    title: "All-in-One Solution\nfor Modern ",
    titleAccent: "Money\nManagement",
    subtitle: "",
    bgType: "gradient",
    gradientFrom: "#3B0FA0",
    gradientTo: "#6B21FF",
    cardType: "blue",
    imageAsset: "https://www.figma.com/api/mcp/asset/6b694222-2950-480d-8d25-bb2d3e3dde76",
  },
  {
    id: 2,
    tag: "",
    title: "Banking Just\n",
    titleAccent: "Got Easier!",
    subtitle: "Unmatched Payment Encryption Technology For Maximum Protection",
    bgType: "light",
    gradientFrom: "",
    gradientTo: "",
    cardType: "stack",
    imageAsset: "https://www.figma.com/api/mcp/asset/62313c68-b58a-44d0-9d6f-818ab3064fc1",
  },
  {
    id: 3,
    tag: "",
    title: "Virtual Payment\nVia ",
    titleAccent: "Cards",
    subtitle: "Unmatched Payment Encryption Technology for Maximum Protection",
    bgType: "light",
    gradientFrom: "",
    gradientTo: "",
    cardType: "stack",
    imageAsset: "https://www.figma.com/api/mcp/asset/94a50e18-7762-443d-90e6-463714fb57a1",
  },
];
