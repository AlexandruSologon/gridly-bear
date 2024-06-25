import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import Sidebar  from "../../interface-elements/Sidebar";
import RunButton from "../../interface-elements/RunButton";
import LockButton from "../../interface-elements/LockButton";
import {iconMappingMock} from "../mocks/iconMappingMock";

  jest.mock('react-leaflet', () => jest.fn());
  jest.mock('firebase-functions', () => jest.fn());

test('Lock', () => {
  render (<LockButton onLockButtonClick={jest.fn()} />);
  const button = screen.getByTestId('lockbutton');
    fireEvent.click(button);
    expect(screen.getByTestId('lock-close-icon')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByTestId('lock-open-icon')).toBeInTheDocument();
});



test('Sidebar', () => {
  render(<Sidebar
                sidebarItems = {[{id: 1, name: 'Solar Panel', type: 'solar'}]}
                handleDragStart = {jest.fn()}
                handleDragEnd = {jest.fn()}
                iconMapping ={iconMappingMock}
                />);
  const sidebar = screen.getByTestId('sidebar');
  expect(sidebar).toContainElement(screen.getByText(/Solar Panel/i));
  const toggleB = screen.getByTestId('retract-sidebar');
  expect(screen.getByTestId('sidebar').style.display).toEqual('grid')
  expect(screen.getByTestId('retract-sidebar-icon-right').style.display).toEqual('none');
  fireEvent.click(toggleB);
   expect(screen.getByTestId('retract-sidebar-icon-right').style.display).toEqual('flex');
  expect(screen.getByTestId('retract-sidebar-icon-left').style.display).toEqual('none')
  expect(screen.getByTestId('sidebar').style.display).toEqual('grid')
  expect(screen.getByTestId("draggable-solar").style.filter).toEqual('none');
  fireEvent.mouseOver(screen.getByTestId("draggable-solar"))
  expect(screen.getByTestId("draggable-solar").style.filter).toEqual('brightness(150%) drop-shadow(0px 0px 7px rgba(25, 49, 101, 0.5))');
  fireEvent.mouseOut(screen.getByTestId("draggable-solar"))
  expect(screen.getByTestId("draggable-solar").style.filter).toEqual('none');


});

test('Run Button', () => {
    render(<RunButton onRunButtonClick={jest.fn()} runClicked={false} />)
    expect(screen.getByTestId('run-button')).toBeInTheDocument()
})


test('Run Button Clicked', () => {
    render(<RunButton onRunButtonClick={jest.fn()} runClicked={true} />)
    expect(screen.getByTestId('run-button')).toBeInTheDocument()
})

