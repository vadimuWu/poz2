package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping()
    public String usersList(ModelMap model, Principal principal) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("authUser", userService.findByEmail(principal.getName()));
        model.addAttribute(new User());
        model.addAttribute("roles",roleService.findAll());
        return "/admin/admin";
    }

    @GetMapping(value = "/{id}")
    public String getUser(ModelMap model, @PathVariable("id") Long id) {
        model.addAttribute("user", userService.findById(id));
        return "/admin/user";
    }

    @PostMapping
    public String createUser(@ModelAttribute("user") @Valid User user,
                             @RequestParam("listroles[]") String[] listroles,
                             BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "/admin/new";
        }

        userService.saveUserAndRoles(user, listroles);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String editUser(ModelMap model, @PathVariable("id") Long id) {
        model.addAttribute("user", userService.findById(id));
        model.addAttribute("roles",roleService.findAll());
        return "/admin/edit";
    }

    @PatchMapping("/{id}")
    public String updateUser(@ModelAttribute("user") @Valid User user,
                             @RequestParam("listroles[]") String[] listroles,
                             BindingResult bindingResult, @PathVariable("id") long id) {
        if (bindingResult.hasErrors()) {
            return "/admin/edit";
        }
        userService.saveUserAndRoles(user, listroles);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }
}
