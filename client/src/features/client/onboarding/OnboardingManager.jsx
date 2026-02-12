import { useOnBoarding } from "./OnBoardingContext";
import StepOne from "./step1/StepOne";
import StepTwo from "./step2/StepTwo";
import StepThree from "./step3/StepThree";
import StepFour from "./step4/StepFour";
import StepFive from "./step5/StepFive";
import StepSix from "./step6/StepSix";

export default function OnboardingManager() {
  const { currentStep } = useOnBoarding();
  

  switch (currentStep) {
    case 1:
      return <StepOne />;
    case 2:
      return <StepTwo />;
    case 3:
      return <StepThree/>;
    case 4:
      return <StepFour/>
    case 5:
      return <StepFive/>
    case 6:
      return <StepSix/>
    default:
      return <StepOne />;
  }
}