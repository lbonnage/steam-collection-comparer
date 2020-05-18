from flask import Flask, render_template, request, url_for, redirect
# from flask_cors import CORS

# Set the project root directory as the website's static folder
app = Flask(__name__,
			static_url_path='',
			static_folder='web/build',
			template_folder='web/build')

# Enable for local testing
# CORS(app)


@app.route('/')
def root():
	return app.send_static_file('index.html')




if __name__ == '__main__':
	app.run()
