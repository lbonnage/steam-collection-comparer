from flask import Flask, request, jsonify
from compare import compare_collections
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


@app.route('/compare', methods=['POST'])
def compare():

	post_data = request.get_json()
	collection_ids = post_data["collections"]

	if len(collection_ids) < 2:
		print("[compare] Failed to compare collections.  Returning error message: " + "You must enter at least 2 collections to compare.")
		response_object = {
			'status': 'fail',
			'message': "You must enter at least 2 collections to compare."
		}
		return jsonify(response_object), 400

	print("[compare] Comparing collection IDs: " + str(collection_ids))
	response_object = None
	try:
		file_information, comparison = compare_collections(collection_ids)
		response_object = {
			'status': 'success',
			'file_information': file_information,
			'comparison': comparison
		}
		return jsonify(response_object), 201
	except Exception as e:
		print("[compare] Failed to compare collections.  Returning error message: " + e)
		response_object = {
			'status': 'fail',
			'message': e
		}
		return jsonify(response_object), 400


if __name__ == '__main__':
	app.run()
