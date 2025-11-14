export const medicosIniciales = [
    {
      id: "1",
      matricula: "MN1001",
      especialidadId: "1", // Pediatría General
      apellidos: "Asimov",
      nombres: "Juan Ignacio",
      descripcion: "Especialista en desarrollo infantil y atención pediátrica integral.",
      obrasSociales: ["101", "103", "106"], // OSDE, Swiss Medical, Galeno
      valorConsulta: 15000.00,
      fotografia: "imagenes/pediatra.jpg"
    },
    {
      id: "2",
      matricula: "MN1002",
      especialidadId: "2", // Oncología Pediátrica
      apellidos: "Armendari",
      nombres: "Analía",
      descripcion: "Diagnóstico, tratamiento y seguimiento de aquellos niños que han desarrollado algún tipo de cáncer.",
      obrasSociales: ["101", "103", "102", "107"], // OSDE, Swiss, OSPE, OSECAC
      valorConsulta: 15500.00,
      fotografia: "imagenes/pediatra2.jpg"
    },
    {
      id: "3",
      matricula: "MN1003",
      especialidadId: "3", // Neurología Pediátrica
      apellidos: "Swabb",
      nombres: "José María",
      descripcion: "Experto en neurología infantil, epilepsia y trastornos del neurodesarrollo.",
      obrasSociales: ["101", "103", "102", "107"],
      valorConsulta: 22500.00,
      fotografia: "imagenes/neurologo.jpg"
    },
    {
      id: "5",
      matricula: "MN1004",
      especialidadId: "5", // Oftalmología Pediátrica
      apellidos: "Ocampo Benitez",
      nombres: "Luz",
      descripcion: "Oftalmóloga pediátrica especializada en prevención y tratamiento de ambliopía.",
      obrasSociales: ["101", "104", "108", "107", "106"],
      valorConsulta: 18000.00,
      fotografia: "imagenes/oculista.jpg"
    },
    {
      id: "4",
      matricula: "MN1005",
      especialidadId: "4", // Cardiología Pediátrica
      apellidos: "DiMaggio",
      nombres: "Hernán A.",
      descripcion: "Cardiólogo pediatra enfocado en prevención y tratamiento de cardiopatías congénitas.",
      obrasSociales: ["103", "101", "102", "109", "106", "107"],
      valorConsulta: 25000.00,
      fotografia: "imagenes/cardiologo.jpg"
    },
    {
      id: "6",
      matricula: "MN1006",
      especialidadId: "6", // Psicología Infantil
      apellidos: "Evrard",
      nombres: "Dominique",
      descripcion: "Psicóloga infantil especializada en desarrollo emocional y aprendizaje.",
      obrasSociales: ["103", "101", "102"],
      valorConsulta: 20000.00,
      fotografia: "imagenes/psicologa.jpg"
    },
    {
      id: "7",
      matricula: "MN1007",
      especialidadId: "7", // Psicopedagogía
      apellidos: "Aleksandrovich",
      nombres: "Ava",
      descripcion: "Licenciada en psicopedagogía, acompañamiento en procesos de aprendizaje infantil.",
      obrasSociales: ["107", "106", "108", "110"],
      valorConsulta: 18000.00,
      fotografia: "imagenes/psicopedagoga.jpg"
    },
    {
      id: "8",
      matricula: "MN1008",
      especialidadId: "8", // Fisioterapia Infantil
      apellidos: "Sosa",
      nombres: "Marcos Leonel",
      descripcion: "Fisioterapeuta infantil especializado en rehabilitación motora y estimulación temprana.",
      obrasSociales: ["107", "102", "101", "104", "105"],
      valorConsulta: 17000.00,
      fotografia: "imagenes/fisioterapeuta.jpg"
    },
    {
      id: "9",
      matricula: "MN1009",
      especialidadId: "9", // Fonoaudiología
      apellidos: "Arias",
      nombres: "Maite Nicole",
      descripcion: "Licenciada en fonoaudiología, especializada en lenguaje, voz y comunicación infantil.",
      obrasSociales: ["107", "102", "101", "103", "111"],
      valorConsulta: 16000.00,
      fotografia: "imagenes/fonoudiologa1.jpg"
    },
    {
      id: "10",
      matricula: "MN1010",
      especialidadId: "10", // Odontopediatría
      apellidos: "Pailler",
      nombres: "Federico R.",
      descripcion: "Odontopediatra con enfoque en prevención y salud bucal infantil.",
      obrasSociales: ["107", "102", "101", "103"],
      valorConsulta: 19000.00,
      fotografia: "imagenes/dentista.jpg"
    },
    {
      id: "11",
      matricula: "MN1011",
      especialidadId: "11", // Nutrición Infantil
      apellidos: "Graciano",
      nombres: "Amelie",
      descripcion: "Nutricionista infantil enfocada en alimentación saludable y control de peso.",
      obrasSociales: ["102", "101", "103", "104", "106"],
      valorConsulta: 17500.00,
      fotografia: "imagenes/nutricionista1.jpg"
    },
    {
      id: "12",
      matricula: "MN1012",
      especialidadId: "12", // Análisis Clínicos
      apellidos: "Telles",
      nombres: "Javier Manuel",
      descripcion: "Bioquímico especialista en análisis clínicos pediátricos y estudios preventivos.",
      obrasSociales: ["102", "101", "103", "104", "111", "105"],
      valorConsulta: 22000.00,
      fotografia: "imagenes/bioquimico.jpg"
    }
  ];
  
  export const especialidadesIniciales = [
    { id: "1", nombre: "Pediatría General" },
    { id: "2", nombre: "Oncología Pediátrica" },
    { id: "3", nombre: "Neurología Pediátrica" },
    { id: "4", nombre: "Cardiología Pediátrica" },
    { id: "5", nombre: "Oftalmología Pediátrica" },
    { id: "6", nombre: "Psicología Infantil" },
    { id: "7", nombre: "Psicopedagogía" },
    { id: "8", nombre: "Fisioterapia Infantil" },
    { id: "9", nombre: "Fonoaudiología" },
    { id: "10", nombre: "Odontopediatría" },
    { id: "11", nombre: "Nutrición Infantil" },
    { id: "12", nombre: "Análisis Clínicos" }
  ];
  
  export const obrasSocialesIniciales = [
    { id: "101", nombre: "OSDE", porcentaje: 35, logo: "osde.png", url: "https://www.osde.com.ar" },
    { id: "102", nombre: "OSPE", porcentaje: 20, logo: "ospe.png", url: "https://www.ospesalud.com.ar/" },
    { id: "103", nombre: "Swiss Medical", porcentaje: 40, logo: "swiss_medical.png", url: "https://www.swissmedical.com.ar" },
    { id: "104", nombre: "Medifé", porcentaje: 25, logo: "medife.png", url: "https://www.medife.com.ar" },
    { id: "105", nombre: "Medicus", porcentaje: 30, logo: "medicus.png", url: "https://medicus.com.ar/" },
    { id: "106", nombre: "Galeno", porcentaje: 30, logo: "galeno.png", url: "https://www.galeno.com.ar" },
    { id: "107", nombre: "OSECAC", porcentaje: 15, logo: "osecac.png", url: "https://www.osecac.org.ar" },
    { id: "108", nombre: "OSDIPP", porcentaje: 10, logo: "osdipp.png", url: "https://www.osdip.com.ar" },
    { id: "109", nombre: "OSTIG", porcentaje: 15, logo: "ostig.png", url: "https://ostig.com.ar/" },
    { id: "110", nombre: "OMINT", porcentaje: 35, logo: "omint.png", url: "https://www.omint.com.ar" },
    { id: "111", nombre: "Sancor Salud", porcentaje: 20, logo: "Sancor salud.png", url: "https://www.sancorsalud.com.ar/" },
    { id: "112", nombre: "Accord Salud", porcentaje: 10, logo: "accord.png", url: "https://www.accordsalud.com.ar/" }
];