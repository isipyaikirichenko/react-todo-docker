import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('добавляет новую задачу', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Новая задача'), {
    target: { value: 'Проверить тест' },
  });
  fireEvent.click(screen.getByText('Добавить'));
  expect(screen.getByText('Проверить тест')).toBeInTheDocument();
});
