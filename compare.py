import http.client
import json
from collections import defaultdict

##
# Provides the comparing functionality.
##

# Establish an HTTP connection to the Steam API  servers.
h = http.client.HTTPConnection("api.steampowered.com")


def get_file_details(file_ids):
	"""
	Retrieve the file details of the inputted file IDs from the Steam Workshop.
	This works for both individual files and collections.
	:param file_ids: List of file ID strings.
	"""

	print("[get_file_details] Retrieving file details for the following file IDs: " + str(file_ids))

	# Create the request to send to the API
	headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
	body = "itemcount=" + str(len(file_ids))
	count = 0
	for id in file_ids:
		body += "&publishedfileids[" + str(count) + "]=" + id
		count += 1

	file_details = None
	# Send the request
	try:
		h.request("POST", "/ISteamRemoteStorage/GetPublishedFileDetails/v1/", body, headers)
		response = h.getresponse()
		file_details = response.read()
	except Exception as e:
		print("Failed retrieving file details using API:\n    Body: " + str(body) + "\n    Exception: " + str(e))
		raise e

	# Retrieve and return the desired information from the response
	file_details_json = json.loads(file_details.decode("utf-8"))
	file_details_json = file_details_json["response"]["publishedfiledetails"]

	return file_details_json


def get_collection_files(collection_ids):
	"""
	Retrieve the files that make up the collections of the inputted collection IDs from the Steam Workshop.
	:param collection_ids: List of collection ID strings.
	"""

	print("[get_collection_files] Retrieving collection files for the following collection IDs: " + str(collection_ids))

	# Create the request to send to the API
	headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
	body = "collectioncount=" + str(len(collection_ids))
	count = 0
	for id in collection_ids:
		body += "&publishedfileids[" + str(count) + "]=" + id
		count += 1

	collection_files = None
	# Send the request
	try:
		h.request("POST", "/ISteamRemoteStorage/GetCollectionDetails/v1/", body, headers)
		response = h.getresponse()
		collection_files = response.read()
	except Exception as e:
		print("Failed retrieving collection files using API:\n    Body: " + str(body) + "\n    Exception: " + str(e))
		raise e

	# Retrieve and return the desired information from the response.
	collection_files_json = json.loads(collection_files.decode("utf-8"))
	collection_files_json = collection_files_json["response"]["collectiondetails"]

	return collection_files_json


def create_file_information(file_details):
	"""
	:param file_details: List of file details retrieved using API.
	:rtype: Dictionary mapping file ID to {title}.
	"""

	file_information = {}

	for file in file_details:
		id = int(file["publishedfileid"])
		title = file["title"]
		# description = file["description"]
		info = {
			"title": title,
			# "description": description
		}
		file_information[id] = info

	return file_information


def compare_collections(collection_ids):
	"""
	:param collection_ids: List of collection ID strings that we wish to compare.
	:rtype: We return two things:
				- A dictionary matching file ID to information such as name and description, which will be used to further
					flesh out the results with additional information.
				- A dictionary relating the files used in the collections and which collections they are included in.
	"""

	print("[compare_collections] Generating a comparison of the following collections: " + str(collection_ids))

	# Retrieve the collection file lists (these are the files in each collection).
	collection_files = get_collection_files(collection_ids)

	# Generate the default dictionary that will contain the comparison information for each file.
	# Have each collection default to False for the file.
	default = {}
	for id in collection_ids:
		default[int(id)] = False
	comparison = defaultdict(lambda: dict(default))

	# Iterate over all of the collections to fill out the dictionary, while also creating a list of all of the
	# associated file IDs using the retrieved information.
	file_ids = set(collection_ids)		# Utilize a set to prevent repeated IDs
	for collection in collection_files:
		collection_id = int(collection["publishedfileid"])
		for file in collection["children"]:
			file_id = file["publishedfileid"]
			file_ids.add(file_id)
			comparison[int(file_id)][collection_id] = True

	# Retrieve the file details (this includes the names and descriptions of the files, including the collections).
	file_details = get_file_details(file_ids)

	# Construct the dictionary matching file ID to information.
	file_information = create_file_information(file_details)

	return file_information, comparison


def create_csv():
	pass