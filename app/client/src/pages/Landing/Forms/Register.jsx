import { useFormik } from "formik"
import { useDispatch } from 'react-redux'
import * as Yup from "yup"
import { register } from '../../../features/auth/authSlice'
import "./Forms.scss"

const Register = () => {
    const {isLoading, isError} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const registerForm = useFormik({
        initialValues: {
          nickname: "",
          city: "",
          email: "",
          password: "",
          confirmPassword: ""
        },
        validationSchema: Yup.object({
          nickname: Yup.string().min(5, "Le pseudo doit contenir au moins 5 charactères").required("Ce champ est obligatoire"),
          city: Yup.string().min(3, "La ville doit comprendre au minmum 3 charactères ").required("Ce champ est obligatoire"),
          email: Yup.string().email("L'email n'est pas valide").required("Ce champ est obligatoire"),
          password: Yup.string().required('Ce champ est obligatoire').min(6, "Le mot de passe doit contenir au moins 6 charactères ").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Le mot de passe doit avoir au moins une majuscule et un chiffre "),
          confirmPassword: Yup.string().required("Ce champ est obligatoire").oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    
        }),
        onSubmit: (values) => {
          dispatch(register(values))
        }
      })
  return (
    <>
    <h1>Inscription</h1>
    <form autoComplete="off" onSubmit={registerForm.handleSubmit}>
    <div className={registerForm.values.nickname.length > 0 ? "field field--has-content" : "field"}>
        <input type="text" id="nickname" className={registerForm.touched.nickname && registerForm.errors.nickname ? "field-input error" : "field-input"} name="nickname" placeholder="Pseudo " onBlur={registerForm.handleBlur} onChange={registerForm.handleChange} value={registerForm.values.nickname} />
        <label htmlFor="nickname" className={registerForm.touched.nickname && registerForm.errors.nickname ? "field-label error" : "field-label"} >Pseudo</label>
        {registerForm.touched.nickname && registerForm.errors.nickname ? <p>{registerForm.errors.nickname}</p> : null}
      </div>
      <div className={registerForm.values.city.length > 0 ? "field field--has-content" : "field"}>
        <input type="text" id="city" className={registerForm.touched.city && registerForm.errors.city ? "field-input error" : "field-input"} name="city" placeholder="Ville" onBlur={registerForm.handleBlur} onChange={registerForm.handleChange} value={registerForm.values.city} />
        <label htmlFor="city" className={registerForm.touched.city && registerForm.errors.city ? "field-label error" : "field-label"} >Ville</label>
        {registerForm.touched.email && registerForm.errors.city ? <p>{registerForm.errors.city}</p> : null}
      </div>
      <div className={registerForm.values.email.length > 0 ? "field field--has-content" : "field"}>
        <input type="text" id="email" className={registerForm.touched.email && registerForm.errors.email ? "field-input error" : "field-input"} name="email" placeholder="Email " onBlur={registerForm.handleBlur} onChange={registerForm.handleChange} value={registerForm.values.email} />
        <label htmlFor="email" className={registerForm.touched.email && registerForm.errors.email ? "field-label error" : "field-label"} >Email</label>
        {registerForm.touched.email && registerForm.errors.email ? <p>{registerForm.errors.email}</p> : null}
      </div>
      <div className={registerForm.values.password.length > 0 ? "field field--has-content" : "field"}>
        <input type="password" id="password" className={registerForm.touched.password && registerForm.errors.password ? "field-input error" : "field-input"} name="password" placeholder="Mot de passe " onBlur={registerForm.handleBlur} onChange={registerForm.handleChange} value={registerForm.values.password} />
        <label htmlFor="password" className={registerForm.touched.password && registerForm.errors.password ? "field-label error" : "field-label"} >Mot de passe</label>
        {registerForm.touched.password && registerForm.errors.password ? <p>{registerForm.errors.password}</p> : null}
      </div>
      <div className={registerForm.values.confirmPassword.length > 0 ? "field field--has-content" : "field"}>
        <input type="password" id="confirmPassword" className={registerForm.touched.confirmPassword && registerForm.errors.confirmPassword ? "field-input error" : "field-input"} name="confirmPassword" placeholder="Confirmer le mot de passe " onBlur={registerForm.handleBlur} onChange={registerForm.handleChange} value={registerForm.values.confirmPassword} />
        <label htmlFor="confirmPassword" className={registerForm.touched.confirmPassword && registerForm.errors.confirmPassword ? "field-label error" : "field-label"} >Confirmer le mot de passe</label>
        {registerForm.touched.confirmPassword && registerForm.errors.confirmPassword ? <p>{registerForm.errors.confirmPassword}</p> : null}
      </div>
        <button className={isLoading || isError ? "btn disabled" : "btn"} type="submit" disabled={isLoading || isError}>{isLoading ? "Envoi...": "C'est parti"}</button>
    </form>
  </>
  )
}
export default Register
