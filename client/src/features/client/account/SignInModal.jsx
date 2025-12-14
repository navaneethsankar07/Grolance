import React from 'react'
import SigninLayout from './components/SigninLayout'
import ModalWrapper from './components/ModelWrapper'

function SignInModal({isOpen, onClose}) {
  return (
    <ModalWrapper onClose={onClose}>
          <SigninLayout onClose={onClose} />
        </ModalWrapper>
  )
}

export default SignInModal