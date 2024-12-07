<?php

// src/Controller/Admin/UserCrudController.php
namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\CartType;
use App\Form\AddressType;
use App\Form\WishlistType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class UserCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureFields(string $pageName): iterable
    {
        $fields = [
            IdField::new('id')->hideOnForm(),
            ImageField::new('img')
                ->setHelp($this->getImageHelp($pageName))
                ->setBasePath('uploads/images/profile') // Chemin de base des images
                ->setUploadDir('public/uploads/images/profile') // Répertoire où les images sont stockées
                ->setUploadedFileNamePattern(function (UploadedFile $file) {
                    $extension = $file->guessExtension();
                    return uniqid() . '.' . $extension; // Utilisation de uniqid pour générer un nom de fichier unique avec l'extension correcte
                }),
            EmailField::new('email'),
            TextField::new('pseudo'),
            DateField::new('birthdate'),
            DateField::new('created_at')->hideOnForm(),
            ArrayField::new('roles')->onlyOnIndex(),
            BooleanField::new('is_verified'),
            CollectionField::new('address')
                ->hideOnIndex()
                ->setEntryType(AddressType::class)
                ->allowAdd()
                ->allowDelete()
                ->setFormTypeOptions([
                    'mapped' => true,
                    'required' => false,
                    'by_reference' => true
                ]),
                CollectionField::new('carts')
                ->hideOnIndex()
                ->setEntryType(CartType::class)
                ->allowAdd(false)
                ->allowDelete()
                ->setFormTypeOptions([
                    'mapped' => true,
                    'required' => false,
                    'by_reference' => true,
                    'attr' => ['readonly' => true]
                ]),
                CollectionField::new('wishlists')
                ->hideOnIndex()
                ->setEntryType(WishlistType::class)
                ->allowAdd(false)
                ->allowDelete()
                ->setFormTypeOptions([
                    'mapped' => true,
                    'required' => false,
                    'by_reference' => false,
                    'attr' => ['readonly' => true]
                ])
        ];

        if ($pageName === Crud::PAGE_INDEX) {
            $fields[] = IntegerField::new('address', 'Address')
                ->formatValue(function ($value, User $user) {
                    $addresses = $user->getAddress();
                    $addressList = '<ul>';
                    foreach ($addresses as $address) {
                        $addressList .= '<li>' . $address->getFirstname() . ' ' . $address->getLastname() . '<br>' . $address->getHousenumber() . ', ' . $address->getStreet() . ' ' . $address->getPostcode() . ' ' . $address->getCity() . '</li>';
                    }
                    $addressList .= '</ul>';
                    return $addressList;
                });
            
                $fields[] = IntegerField::new('carts', 'Carts')
                ->formatValue(function ($value, User $user) {
                    $carts = $user->getCarts();
                    $cartList = '<ul>';
                    foreach ($carts as $cart) {
                        $cartList .= '<li>' . $cart->getProduct()->getName() . ' x' . $cart->getQuantity() . '<br>' . $cart->getPlatform() . '</li>';
                    }
                    $cartList .= '</ul>';
                    return $cartList;
                });
        }

        return $fields;
    }

    private function getImageHelp(string $pageName): string
    {
        if ($pageName === Crud::PAGE_EDIT) {
            $product = $this->getContext()->getEntity()->getInstance();
            if ($product && $product->getImg()) {
                $imagePath = 'uploads/images/profile/' . $product->getImg();
                return '<img src="' . $imagePath . '" alt="Product Image" style="max-width: 100%;">';
            }
        }

        return '';
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setSearchFields(['address.housenumber', 'address.street','address.city','address.postcode','address.firstname','address.lastname',]);
    }
}





