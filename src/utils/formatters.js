/**
 * Formata um número de telefone no padrão (XX) XXXXX-XXXX
 * @param {string} valor - Valor do telefone a ser formatado
 * @returns {string} Telefone formatado
 */
export const formatarTelefone = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, "");
  
  if (apenasNumeros.length === 0) return "";
  if (apenasNumeros.length <= 2) return `(${apenasNumeros}`;
  if (apenasNumeros.length <= 7) 
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  
  return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
};

/**
 * Formata um CPF no padrão XXX.XXX.XXX-XX
 * @param {string} valor - Valor do CPF a ser formatado
 * @returns {string} CPF formatado
 */
export const formatarCPF = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, "");
  
  if (apenasNumeros.length === 0) return "";
  if (apenasNumeros.length <= 3) return apenasNumeros;
  if (apenasNumeros.length <= 6) 
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
  if (apenasNumeros.length <= 9) 
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
  
  return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
};
