import { Children, createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";


const OnBoardingContext = createContext();

export const OnBoardingProvider = ({children}) => {
    const [formData, setFormData] = useState({
        tagline:'',
        bio:'',
        phone:'',
        agreedToTerms:false,
        primaryCategory:'',
        skills:[],
        experienceLevel:'',
        packages:{
            starter:{price:'',deliveryTime:'',description:''},
            pro:{price:'',deliveryTime:'',description:''}
        },
         portfolios:[],
        
        bankDetails: {
            fullName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branchName: '',
            isConfirmed: false
        }


        


    })
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 6;

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setCurrentStep(prev => Math.max(prev-1,1))

    const updateFormData = (newData) => {
        setFormData((prev)=>({...prev,...newData}))
    }
 

    return (
        <OnBoardingContext.Provider value={{
            formData,
            updateFormData,
            currentStep,
            totalSteps,
            nextStep,
            prevStep
        }}>
            {children || <Outlet/>}
        </OnBoardingContext.Provider>
    )
}

export const useOnBoarding = () => useContext(OnBoardingContext)