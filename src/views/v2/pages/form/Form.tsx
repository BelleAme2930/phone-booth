import React, { useState, useRef, useEffect } from 'react';
import jLogo from '@assets/jameson-logo.png';
import tabKey from '@assets/tab.svg';
import sup3rnovaLogo from "@assets/logo.png";
import delKey from '@assets/delete.svg';
import bottle from '@assets/bottle.png';

type FormData = {
    fullName: string;
    email: string;
    phone: string;
}

function Form() {

    const [focusedInput, setFocusedInput] = useState<string>("");
    const [formValues, setFormValues] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
    });

    const [upperCaseMode, setUpperCaseMode] = useState(false);

    const handleKeyPress = (key: any) => {
        if (focusedInput) {
            const currentValue = formValues[focusedInput as keyof FormData];
            const updatedValue = upperCaseMode ? currentValue + key.toUpperCase() : currentValue + key.toLowerCase();
            console.log(currentValue + key.toUpperCase());
            setFormValues((prevValues) => ({
                ...prevValues,
                [focusedInput]: updatedValue,
            }));
        }
    };
    

    const handleTabKeyClick = () => {
    setUpperCaseMode((prevMode) => !prevMode);
};


    useEffect(() => {
        const handleKeyboardClick = (e: any) => {
            const keyPressed = e.target.innerText;
            handleKeyPress(keyPressed);
        };

        const keyboardButtons = document.querySelectorAll('.key');
        keyboardButtons.forEach((button) => {
            button.addEventListener('click', handleKeyboardClick);
        });

        return () => {
            keyboardButtons.forEach((button) => {
                button.removeEventListener('click', handleKeyboardClick);
            });
        };
    }, [focusedInput]);


    return (

        <div className="form">

            <div className="flex 2xl:pt-20">
                <div className="w-[40%]">
                    <div className="mx-10 relative z-30 flex flex-col justify-between md:pt-10 2xl:pt-14 mb-10 2xl:mb-10">
                        <div className="text-center md:mb-6 2xl:mb-5"><img src={jLogo} alt="Jameson Logo" className="h-auto mx-auto md:w-[180px] lg:w-[220px] 2xl:w-[300px]"></img></div>
                    </div>
                    <div className='keyboard bg-[#007749] py-20 px-8 rounded-md'>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex justify-center gap-2 text-black flex-1">
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">q</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">w</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">e</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">r</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">t</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">y</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">u</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">i</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">o</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">p</button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <div className="flex justify-center gap-2 text-black flex-1">
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">a</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">s</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">d</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">f</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">g</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">h</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">j</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">k</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">l</button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <div className="flex justify-center gap-2 text-black flex-1">
                                <button className="key font-semibold rounded-[5px] text-[22px] open-sans flex items-center justify-center special-key bg-[#ADB3BC] w-[40px]" onClick={handleTabKeyClick}><img src={tabKey}></img></button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">z</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">x</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">c</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">v</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">b</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">n</button>
                                <button className="key font-semibold w-[30px] bg-white h-[40px] rounded-[5px] text-[22px] open-sans flex items-center justify-center">m</button>
                                <button className="key font-semibold rounded-[5px] text-[22px] open-sans flex items-center justify-center special-key bg-[#ADB3BC] w-[40px]"><img src={delKey}></img></button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <div className="flex justify-center gap-2 text-black w-full">
                                <button className="key font-semibold rounded-[5px] text-[16px] h-[40px] open-sans flex items-center justify-center special-key bg-[#ADB3BC] w-[80px]">123</button>
                                <button className="key font-semibold bg-white rounded-[5px] text-[16px] h-[40px] open-sans flex items-center justify-center w-[180px]">space</button>
                                <button className="key font-semibold rounded-[5px] text-[16px] h-[40px] open-sans flex items-center justify-center special-key bg-[#ADB3BC] w-[80px]">return</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[35%]">
                    <div className='form-holder pt-[120px] px-5'>
                        <p className='text-[18px] text-[#F1E4B2] open-sans text-left mb-4'>¡Ya ves lo divertido que es ampliar tu círculo! Queremos premiarte por haber aceptado el reto, coloca tu información para recibir una sorpresa.</p>
                        <form action="/">
                            <input
                                className="open-sans rounded-[5px] w-full border-none focus:outline-none h-[50px] text-[16px] mb-4 text-black"
                                type="text"
                                placeholder="Nombre Completo"
                                value={formValues.fullName}
                                onFocus={() => setFocusedInput("fullName")}
                                onChange={(e) => setFormValues({ ...formValues, fullName: e.target.value })}
                            />
                            <input
                                className="open-sans rounded-[5px] w-full border-none focus:outline-none h-[50px] text-[16px] mb-4 text-black"
                                type="email"
                                placeholder="E-mail"
                                value={formValues.email}
                                onFocus={() => setFocusedInput("email")}
                                onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                            />
                            <input
                                className="open-sans rounded-[5px] w-full border-none focus:outline-none h-[50px] text-[16px] mb-4 text-black"
                                type="number"
                                placeholder="Teléfono"
                                value={formValues.phone}
                                onFocus={() => setFocusedInput("phone")}
                                onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                            />
                            <button type='submit' className='w-full bg-[#880D27] h-[60px] text-[24px] letter-spacing-10 open-sans font-bold'>ENVIAR</button>
                        </form>
                    </div>
                </div>
                <div className="w-[25%] text-center flex justify-center">
                    <img src={sup3rnovaLogo} alt="Jameson" className='mt-[40px] 2xl:-mt-[30px] lg:h-[100px] xl:h-[120px] 2xl-[160px]'></img>
                    <img src={bottle} alt="Jameson" className='h-[70%] 2xl:h-[80%] xl:ml-[10px] 2xl:ml-[30px] absolute bottom-0 w-auto' />
                </div>
            </div>

        </div>


    )
}


export default Form;