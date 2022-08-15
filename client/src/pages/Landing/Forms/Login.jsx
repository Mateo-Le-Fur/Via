import { useFormik } from "formik"
import * as Yup from "yup"
import "./Forms.scss"

const Login = () => {
    const loginForm = useFormik({
        initialValues: {
          email: "",
          password: ""
        },
        validationSchema: Yup.object({
          email: Yup.string().email("L'email n'est pas valide").required("Ce champ est obligatoire"),
          password: Yup.string().required('Le mot de passe est obligatoire').min(6, "Le mot de passe doit contenir 6 charactères").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Le mot doit avoir au moins une majuscule et un chiffre")
        }),
        onSubmit: (values) => {
          console.log(values)
        }
      })


  return (
    <>
              <h1>Connexion</h1>
              <form autoComplete="off" onSubmit={loginForm.handleSubmit}>
                <div className={loginForm.values.email.length > 0 ? "field field--has-content" : "field"}>
                  <input type="text" id="email" className={loginForm.touched.email && loginForm.errors.email ? "field-input error" : "field-input"} name="email" placeholder="Email " onBlur={loginForm.handleBlur} onChange={loginForm.handleChange} value={loginForm.values.email} />
                  <label htmlFor="email" className={loginForm.touched.email && loginForm.errors.email ? "field-label error" : "field-label"} >Email</label>
                  {loginForm.touched.email && loginForm.errors.email ? <p>{loginForm.errors.email}</p> : null}
                </div>
                <div className={loginForm.values.password.length > 0 ? "field field--has-content" : "field"}>
                  <input type="password" id="password" className={loginForm.touched.password && loginForm.errors.password ? "field-input error" : "field-input"} name="password" placeholder="Mot de passe " onBlur={loginForm.handleBlur} onChange={loginForm.handleChange} value={loginForm.values.password} />
                  <label htmlFor="password" className={loginForm.touched.password && loginForm.errors.password ? "field-label error" : "field-label"} >Mot de passe</label>
                  {loginForm.touched.password && loginForm.errors.password ? <p>{loginForm.errors.password}</p> : null}
                </div>
                <button className="btn" type="submit">C'est parti</button>
              </form>
            </>
  )
}
export default Login