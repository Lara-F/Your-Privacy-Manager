pragma solidity ^ 0.5 .0;

contract PrivacyManager {
    struct UserSettingStruct {
        bytes setting_graph;
        uint index;
    }
    mapping(bytes32 => UserSettingStruct) private userSettingStructs;

    bytes32[] private userSettingIndex;

    event PrivacySetting(bytes32 user, bytes setting);
    event SettingChange(bytes32 user, bytes setting);
    event CheckSetting(address OSN, bytes32 user, bool result);

    function isSet(bytes32 _address) public view returns(bool exists) {
        if (userSettingIndex.length == 0) return false;
        return (userSettingIndex[userSettingStructs[_address].index] == _address);
    }

    function setPrivacy(bytes32 _msg_sender, bytes memory _setting_graph) public returns(bool success) {
        if (!isSet(_msg_sender)) {
            userSettingStructs[_msg_sender].setting_graph = _setting_graph;
            userSettingStructs[_msg_sender].index = userSettingIndex.push(_msg_sender) - 1;
            emit PrivacySetting(_msg_sender, _setting_graph);
            return true;
        } else {
            userSettingStructs[_msg_sender].setting_graph = _setting_graph;
            emit SettingChange(_msg_sender, _setting_graph);
            return true;
        }
    }
    function checkSettingGraph(bytes32 _user, bytes memory _request) public {

        if (!isSet(_user)) {
            emit CheckSetting(msg.sender, _user, false);
            return;
        }
        bytes memory setting_graph = userSettingStructs[_user].setting_graph;
        if (setting_graph.length != _request.length) {
            emit CheckSetting(msg.sender, _user, false);
            return;
        } else {
            for (uint i = 0; i < setting_graph.length; i++) {
                if ((setting_graph[i] | _request[i]) > setting_graph[i]) {
                    emit CheckSetting(msg.sender, _user, false);
                    return;
                }
            }
            emit CheckSetting(msg.sender, _user, true);
        }
    }
}