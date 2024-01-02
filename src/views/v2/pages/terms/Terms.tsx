import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Terms() {
    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: any) => {
    event.preventDefault();
    setIsChecked(!isChecked);
  };

  const handleAceptarClick = () => {
    if (isChecked) {
        navigate('/');
    }
  };

  const handleCancelarClick = () => {
    const confirmCancel = window.confirm('Are you sure?');
    if (confirmCancel) {
        navigate('/');
    }
  };

    return (
        <>
            <div className="terms text-left md:py-10 2xl:py-20 text-[#6B6B6B] max-w-[95%] mx-auto">
                <h1 className="text-[30px] text-[#007749] mb-7">Términos y Condiciones</h1>
                <h2 className="text-[24px] text-[#132F41] mb-7">Términos</h2>
                <div className="h-[600px] overflow-y-auto open-sans">
                    <p className="mb-6">1. Aceptación de los Términos Al descargar y utilizar esta aplicación, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con ellos, por favor no use la aplicación.</p>

                    <p className="mb-6">2. Uso Apropiado Esta aplicación está destinada exclusivamente para usuarios mayores de edad legal para consumir bebidas alcohólicas en su país de residencia. Usted acepta usar la aplicación solo para fines legales y de manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute de la aplicación por parte de terceros.</p>

                    <p className="mb-6">3. Propiedad Intelectual Todo el contenido incluido en la aplicación, como textos, gráficos, logos, imágenes, así como la compilación de estos, es propiedad de Pernod Ricard o sus licenciantes y está protegido por leyes de derechos de autor y marcas registradas.</p>

                    <p className="mb-6">4. Limitación de Responsabilidad Pernod Ricard no se hace responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar esta aplicación.</p>

                    <p className="mb-6">5. Privacidad Su privacidad es importante para nosotros. Por favor, revise nuestra Política de Privacidad, que también rige su uso de la aplicación, para entender nuestras prácticas.</p>
                    <p className="mb-6">6. Cambios en los Términos Pernod Ricard se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Se considerará que usted acepta dichos cambios si continúa utilizando la aplicación después de que se hayan publicado.</p>
                    <p className="mb-6">7. Legislación Aplicable Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde Pernod Ricard tiene su sede principal, sin dar efecto a ningún principio de conflictos de leyes.</p>
                    <p className="mb-6">8. Contacto Si tiene alguna pregunta sobre estos términos, por favor contacte a [correo electrónico/medio de contacto].</p>
                </div>
                <div className="flex justify-between">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-green-900" readOnly onChange={handleCheckboxChange}/>
                    <span className="text-[16px] text-gray-700">
                        Confirmo que he leído y acepto los términos y condiciones y la política de privacidad.
                    </span>
                </label>
                <div className="flex justify-between gap-10 items-center">
                    <Link to="/" className="text-[#007749] text-[16px] border-none hover:border-none hover:text-[#007749]" onClick={handleCancelarClick} >Cancelar</Link>
                    <button disabled={!isChecked} className="text-white text-[16px] bg-[#007749] p-[10px] w-[164px] rounded-[5px] text-center hover:text-white" onClick={handleAceptarClick}>Aceptar</button>
                </div>
                </div>
            </div>
        </>
    );
}

export default Terms;