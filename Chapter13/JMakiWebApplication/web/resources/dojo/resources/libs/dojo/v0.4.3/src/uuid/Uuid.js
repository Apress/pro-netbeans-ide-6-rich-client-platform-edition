/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/



djd43.provide("djd43.uuid.Uuid");
djd43.require("djd43.lang.common");
djd43.require("djd43.lang.assert");
djd43.uuid.Uuid = function (input) {
	this._uuidString = djd43.uuid.Uuid.NIL_UUID;
	if (input) {
		if (djd43.lang.isString(input)) {
			this._uuidString = input.toLowerCase();
			djd43.lang.assert(this.isValid());
		} else {
			if (djd43.lang.isObject(input) && input.generate) {
				var generator = input;
				this._uuidString = generator.generate();
				djd43.lang.assert(this.isValid());
			} else {
				djd43.lang.assert(false, "The djd43.uuid.Uuid() constructor must be initializated with a UUID string.");
			}
		}
	} else {
		var ourGenerator = djd43.uuid.Uuid.getGenerator();
		if (ourGenerator) {
			this._uuidString = ourGenerator.generate();
			djd43.lang.assert(this.isValid());
		}
	}
};
djd43.uuid.Uuid.NIL_UUID = "00000000-0000-0000-0000-000000000000";
djd43.uuid.Uuid.Version = {UNKNOWN:0, TIME_BASED:1, DCE_SECURITY:2, NAME_BASED_MD5:3, RANDOM:4, NAME_BASED_SHA1:5};
djd43.uuid.Uuid.Variant = {NCS:"0", DCE:"10", MICROSOFT:"110", UNKNOWN:"111"};
djd43.uuid.Uuid.HEX_RADIX = 16;
djd43.uuid.Uuid.compare = function (uuidOne, uuidTwo) {
	var uuidStringOne = uuidOne.toString();
	var uuidStringTwo = uuidTwo.toString();
	if (uuidStringOne > uuidStringTwo) {
		return 1;
	}
	if (uuidStringOne < uuidStringTwo) {
		return -1;
	}
	return 0;
};
djd43.uuid.Uuid.setGenerator = function (generator) {
	djd43.lang.assert(!generator || (djd43.lang.isObject(generator) && generator.generate));
	djd43.uuid.Uuid._ourGenerator = generator;
};
djd43.uuid.Uuid.getGenerator = function () {
	return djd43.uuid.Uuid._ourGenerator;
};
djd43.uuid.Uuid.prototype.toString = function (format) {
	if (format) {
		switch (format) {
		  case "{}":
			return "{" + this._uuidString + "}";
			break;
		  case "()":
			return "(" + this._uuidString + ")";
			break;
		  case "\"\"":
			return "\"" + this._uuidString + "\"";
			break;
		  case "''":
			return "'" + this._uuidString + "'";
			break;
		  case "urn":
			return "urn:uuid:" + this._uuidString;
			break;
		  case "!-":
			return this._uuidString.split("-").join("");
			break;
		  default:
			djd43.lang.assert(false, "The toString() method of djd43.uuid.Uuid was passed a bogus format.");
		}
	} else {
		return this._uuidString;
	}
};
djd43.uuid.Uuid.prototype.compare = function (otherUuid) {
	return djd43.uuid.Uuid.compare(this, otherUuid);
};
djd43.uuid.Uuid.prototype.isEqual = function (otherUuid) {
	return (this.compare(otherUuid) == 0);
};
djd43.uuid.Uuid.prototype.isValid = function () {
	try {
		djd43.lang.assertType(this._uuidString, String);
		djd43.lang.assert(this._uuidString.length == 36);
		djd43.lang.assert(this._uuidString == this._uuidString.toLowerCase());
		var arrayOfParts = this._uuidString.split("-");
		djd43.lang.assert(arrayOfParts.length == 5);
		djd43.lang.assert(arrayOfParts[0].length == 8);
		djd43.lang.assert(arrayOfParts[1].length == 4);
		djd43.lang.assert(arrayOfParts[2].length == 4);
		djd43.lang.assert(arrayOfParts[3].length == 4);
		djd43.lang.assert(arrayOfParts[4].length == 12);
		for (var i in arrayOfParts) {
			var part = arrayOfParts[i];
			var integer = parseInt(part, djd43.uuid.Uuid.HEX_RADIX);
			djd43.lang.assert(isFinite(integer));
		}
		return true;
	}
	catch (e) {
		return false;
	}
};
djd43.uuid.Uuid.prototype.getVariant = function () {
	var variantCharacter = this._uuidString.charAt(19);
	var variantNumber = parseInt(variantCharacter, djd43.uuid.Uuid.HEX_RADIX);
	djd43.lang.assert((variantNumber >= 0) && (variantNumber <= 16));
	if (!djd43.uuid.Uuid._ourVariantLookupTable) {
		var Variant = djd43.uuid.Uuid.Variant;
		var lookupTable = [];
		lookupTable[0] = Variant.NCS;
		lookupTable[1] = Variant.NCS;
		lookupTable[2] = Variant.NCS;
		lookupTable[3] = Variant.NCS;
		lookupTable[4] = Variant.NCS;
		lookupTable[5] = Variant.NCS;
		lookupTable[6] = Variant.NCS;
		lookupTable[7] = Variant.NCS;
		lookupTable[8] = Variant.DCE;
		lookupTable[9] = Variant.DCE;
		lookupTable[10] = Variant.DCE;
		lookupTable[11] = Variant.DCE;
		lookupTable[12] = Variant.MICROSOFT;
		lookupTable[13] = Variant.MICROSOFT;
		lookupTable[14] = Variant.UNKNOWN;
		lookupTable[15] = Variant.UNKNOWN;
		djd43.uuid.Uuid._ourVariantLookupTable = lookupTable;
	}
	return djd43.uuid.Uuid._ourVariantLookupTable[variantNumber];
};
djd43.uuid.Uuid.prototype.getVersion = function () {
	if (!this._versionNumber) {
		var errorMessage = "Called getVersion() on a djd43.uuid.Uuid that was not a DCE Variant UUID.";
		djd43.lang.assert(this.getVariant() == djd43.uuid.Uuid.Variant.DCE, errorMessage);
		var versionCharacter = this._uuidString.charAt(14);
		this._versionNumber = parseInt(versionCharacter, djd43.uuid.Uuid.HEX_RADIX);
	}
	return this._versionNumber;
};
djd43.uuid.Uuid.prototype.getNode = function () {
	if (!this._nodeString) {
		var errorMessage = "Called getNode() on a djd43.uuid.Uuid that was not a TIME_BASED UUID.";
		djd43.lang.assert(this.getVersion() == djd43.uuid.Uuid.Version.TIME_BASED, errorMessage);
		var arrayOfStrings = this._uuidString.split("-");
		this._nodeString = arrayOfStrings[4];
	}
	return this._nodeString;
};
djd43.uuid.Uuid.prototype.getTimestamp = function (returnType) {
	var errorMessage = "Called getTimestamp() on a djd43.uuid.Uuid that was not a TIME_BASED UUID.";
	djd43.lang.assert(this.getVersion() == djd43.uuid.Uuid.Version.TIME_BASED, errorMessage);
	if (!returnType) {
		returnType = null;
	}
	switch (returnType) {
	  case "string":
	  case String:
		return this.getTimestamp(Date).toUTCString();
		break;
	  case "hex":
		if (!this._timestampAsHexString) {
			var arrayOfStrings = this._uuidString.split("-");
			var hexTimeLow = arrayOfStrings[0];
			var hexTimeMid = arrayOfStrings[1];
			var hexTimeHigh = arrayOfStrings[2];
			hexTimeHigh = hexTimeHigh.slice(1);
			this._timestampAsHexString = hexTimeHigh + hexTimeMid + hexTimeLow;
			djd43.lang.assert(this._timestampAsHexString.length == 15);
		}
		return this._timestampAsHexString;
		break;
	  case null:
	  case "date":
	  case Date:
		if (!this._timestampAsDate) {
			var GREGORIAN_CHANGE_OFFSET_IN_HOURS = 3394248;
			var arrayOfParts = this._uuidString.split("-");
			var timeLow = parseInt(arrayOfParts[0], djd43.uuid.Uuid.HEX_RADIX);
			var timeMid = parseInt(arrayOfParts[1], djd43.uuid.Uuid.HEX_RADIX);
			var timeHigh = parseInt(arrayOfParts[2], djd43.uuid.Uuid.HEX_RADIX);
			var hundredNanosecondIntervalsSince1582 = timeHigh & 4095;
			hundredNanosecondIntervalsSince1582 <<= 16;
			hundredNanosecondIntervalsSince1582 += timeMid;
			hundredNanosecondIntervalsSince1582 *= 4294967296;
			hundredNanosecondIntervalsSince1582 += timeLow;
			var millisecondsSince1582 = hundredNanosecondIntervalsSince1582 / 10000;
			var secondsPerHour = 60 * 60;
			var hoursBetween1582and1970 = GREGORIAN_CHANGE_OFFSET_IN_HOURS;
			var secondsBetween1582and1970 = hoursBetween1582and1970 * secondsPerHour;
			var millisecondsBetween1582and1970 = secondsBetween1582and1970 * 1000;
			var millisecondsSince1970 = millisecondsSince1582 - millisecondsBetween1582and1970;
			this._timestampAsDate = new Date(millisecondsSince1970);
		}
		return this._timestampAsDate;
		break;
	  default:
		djd43.lang.assert(false, "The getTimestamp() method djd43.uuid.Uuid was passed a bogus returnType: " + returnType);
		break;
	}
};

