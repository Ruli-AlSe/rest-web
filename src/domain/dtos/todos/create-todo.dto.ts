export class CreateTodoDto {
  private constructor(public readonly text: string) {}

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { text } = props;
    if (!text) return ['Text property is required', undefined];

    const textCapitalized = text.charAt(0).toUpperCase() + text.slice(1);

    return [undefined, new CreateTodoDto(textCapitalized)];
  }
}
