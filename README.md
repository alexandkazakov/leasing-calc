# leasing-calc
Test task for Friend-lee: car leasing calculator.

Test task: https://github.com/friendlee-digital/test-task-html-figma

Run dev version (with local server): npm run dev
Run build version: npm run build

Вопросы и проблемы:
- Макет не полностью соответствует PixelParallel, верстка выполнена с учетом PixelPerfect. Так, при необходимости, проще вернуть к PixelParallel, чем наоборот.
- Стандартные возможности CSS для input[range] не позволяют выполнить разную стилизацию левой и правой части от ползунка. Требуется применение JS. Оставил до реализации самого калькулятора. В одной из библиотек видел реализацию в JS через linear-gradient в зависимости от положения ползунка. Для реализации требуется чуть больше времени.
