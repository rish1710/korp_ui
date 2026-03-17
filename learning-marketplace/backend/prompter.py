import os
from jinja2 import Environment, FileSystemLoader

class Prompter:
    def __init__(self, prompt_template: str):
        """
        Initializes the Prompter with the specific template name.
        Assumes templates are stored in a 'prompts' directory relative to the current working directory.
        The template name should not include the '.jinja' extension.
        """
        self.template_name = prompt_template
        # Determine the base directory of the project (assuming it's running from /backend)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        prompts_dir = os.path.join(base_dir, "prompts")
        
        # Adjust for nested prompts if needed (e.g., 'ask/entry')
        template_file = f"{self.template_name}.jinja"
        
        self.env = Environment(loader=FileSystemLoader(searchpath=prompts_dir))
        try:
            self.template = self.env.get_template(template_file)
        except Exception as e:
            raise FileNotFoundError(f"Template '{template_file}' not found in '{prompts_dir}'.") from e

    def render(self, data: dict = None, **kwargs) -> str:
        """
        Renders the Jinja template with the provided data dict and/or kwargs.
        """
        context = data or {}
        context.update(kwargs)
        
        # If there are format instructions provided via a parser, this would be the place to inject them, 
        # but for now we expect 'format_instructions' in the data or kwargs if needed by the template.
        
        return self.template.render(**context)

# Example usage:
# prompter = Prompter("ask/entry")
# result = prompter.render(data={"question": "What is RAG?"})
