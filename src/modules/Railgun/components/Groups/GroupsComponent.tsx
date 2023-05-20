import { useEffect, useState } from 'react';
import { Group } from '../../utils/types';
import GroupsForm from '../GroupsForm';

const GroupsComponent = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('groups');
    if (storedData) {
      setGroups(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
    console.log(`stored to localstorage: ${JSON.stringify(groups)}`);
  }, [groups]);

  const handleGroupChange = (index: number, name: string) => {
    setGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((group) => ({
        ...group, 
        selected: false
      }));
      console.log(`TEST groupChange index ${index} prev length ${updatedGroups.length} newName ${name}`)
      updatedGroups[index].name = name;
      updatedGroups[index].selected = true;
      return updatedGroups;
    });
  };

  const handleAddGroup = () => {
    setGroups((prevGroups) => {
      console.log(`TEST Add Group called prev length ${prevGroups.length}`);
      const updatedGroups = prevGroups.map((group) => ({
        ...group, 
        selected: false
      }));
      return [
      ...updatedGroups,
      { name: '', addresses: [], selected: true }
    ]});
  };

  const handleAddressChange = (groupIndex: number, addressIndex: number, address: string, nickname: string, amount: number) => {
    setGroups((prevAddresses) => {
      console.log(`TEST change address called  groupIndex ${groupIndex} address Index ${addressIndex} address ${address} nickname ${nickname} amount ${amount}`)
      const updatedGroups = [...prevAddresses];
      updatedGroups[groupIndex].addresses[addressIndex] = { address, nickname, amount };
      return updatedGroups;
    });
  };

  const handleAddAddress = (groupIndex: number) => {
    setGroups((prevAddresses) => {
      console.log(`TEST Add Address called for group ${groupIndex} prev length ${prevAddresses.length}`);
      const updatedGroups = [...prevAddresses];
      updatedGroups[groupIndex].addresses.push({ address: '', nickname: '', amount: 0 });
      return updatedGroups;
    });
  };

  if (groups.length == 0) {
    handleAddGroup()
  }

  return (
    <div>
      <GroupsForm groups={groups} onGroupChange={handleGroupChange} onAddGroup={handleAddGroup} onAddressChange={handleAddressChange} onAddAddress={handleAddAddress} />
    </div>
  );
}

export default GroupsComponent;