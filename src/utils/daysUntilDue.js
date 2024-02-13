const calculateDaysUntilDue = (dueDateInSeconds) => {
  const currentDate = new Date();
  const dueDate = new Date(dueDateInSeconds * 1000); // Converte segundos para milissegundos

  // Calcula a diferença em milissegundos
  const differenceInTime = dueDate.getTime() - currentDate.getTime();

  // Calcula a diferença em dias
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
};

export default calculateDaysUntilDue;
